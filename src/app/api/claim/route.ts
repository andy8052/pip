import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, launches } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { setFeeRouterRecipient } from "@/lib/fee-router";
import type { Address } from "viem";

const claimSchema = z.object({
  launchId: z.string().uuid(),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

/**
 * Claim a token launch.
 *
 * Each Doppler pool has a BeneficiaryFeeRouter contract set as the creator's
 * on-chain beneficiary. When the creator claims, we:
 *   1. Record their wallet in the database.
 *   2. Call `setRecipient` on the fee router so accumulated (and future)
 *      fees are forwarded to the creator's wallet.
 */
export async function POST(req: NextRequest) {
  const privyUser = await getAuthenticatedUser(req);
  if (!privyUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const twitterUsername = privyUser.twitter?.username;
  if (!twitterUsername) {
    return NextResponse.json(
      { error: "No Twitter account linked to your Privy account" },
      { status: 400 }
    );
  }

  let body;
  try {
    body = claimSchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid input", details: e },
      { status: 400 }
    );
  }

  // Get or create DB user
  let [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.privyDid, privyUser.id))
    .limit(1);

  if (!dbUser) {
    [dbUser] = await db
      .insert(users)
      .values({
        privyDid: privyUser.id,
        twitterUsername,
        twitterName: privyUser.twitter?.name ?? null,
        twitterProfilePicture: privyUser.twitter?.profilePictureUrl ?? null,
        walletAddress: body.walletAddress,
      })
      .returning();
  } else {
    // Update wallet address
    [dbUser] = await db
      .update(users)
      .set({ walletAddress: body.walletAddress })
      .where(eq(users.id, dbUser.id))
      .returning();
  }

  // Atomic claim: only claim if not already claimed and target matches
  const [launch] = await db
    .update(launches)
    .set({
      claimed: true,
      claimedByUserId: dbUser.id,
      claimedAt: new Date(),
      claimerWalletAddress: body.walletAddress,
    })
    .where(
      and(
        eq(launches.id, body.launchId),
        eq(launches.targetTwitterUsername, twitterUsername),
        eq(launches.claimed, false),
        eq(launches.status, "deployed")
      )
    )
    .returning();

  if (!launch) {
    return NextResponse.json(
      {
        error:
          "Token not found, already claimed, not deployed, or you are not the target profile owner",
      },
      { status: 404 }
    );
  }

  // Point the fee router at the creator's wallet so future fee forwards
  // go directly to them. If the launch was created before fee routers were
  // introduced (no feeRouterAddress), we skip this step gracefully.
  if (launch.feeRouterAddress) {
    try {
      await setFeeRouterRecipient(
        launch.feeRouterAddress as Address,
        body.walletAddress as Address
      );
    } catch (error) {
      // Log but don't fail the claim — the DB record is already updated
      // and the admin can manually set the recipient later.
      console.error(
        `Failed to set fee router recipient for ${launch.feeRouterAddress}:`,
        error
      );
    }
  }

  return NextResponse.json({ launch });
}
