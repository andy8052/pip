import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, launches } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { updateRewardRecipient, updateVaultBeneficiary } from "@/lib/clanker";

const claimSchema = z.object({
  launchId: z.string().uuid(),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

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

  if (!launch.tokenAddress) {
    return NextResponse.json(
      { error: "Token address not available" },
      { status: 400 }
    );
  }

  const claimerWallet = body.walletAddress as `0x${string}`;
  const tokenAddr = launch.tokenAddress as `0x${string}`;

  try {
    // On-chain tx 1: Update reward recipient (slot 0 = 80% fees)
    const { txHash: claimTxHash } = await updateRewardRecipient(
      tokenAddr,
      0n,
      claimerWallet
    );

    // On-chain tx 2: Update vault beneficiary
    const { txHash: vaultClaimTxHash } = await updateVaultBeneficiary(
      tokenAddr,
      claimerWallet
    );

    // Update DB with tx hashes
    const [updated] = await db
      .update(launches)
      .set({
        claimTxHash,
        vaultClaimTxHash,
      })
      .where(eq(launches.id, launch.id))
      .returning();

    return NextResponse.json({ launch: updated });
  } catch (error) {
    // Revert the claim in DB on failure
    await db
      .update(launches)
      .set({
        claimed: false,
        claimedByUserId: null,
        claimedAt: null,
        claimerWalletAddress: null,
      })
      .where(eq(launches.id, launch.id));

    console.error("Claim on-chain tx failed:", error);
    return NextResponse.json(
      {
        error: "On-chain claim transaction failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
