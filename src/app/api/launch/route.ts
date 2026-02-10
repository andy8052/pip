import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, launches } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";
import { deployToken } from "@/lib/doppler";

const launchSchema = z.object({
  targetTwitterUsername: z
    .string()
    .min(1)
    .max(64)
    .transform((v) => v.replace(/^@/, "")),
  targetTwitterName: z.string().max(256).default(""),
  targetTwitterProfilePicture: z.string().url().optional().default(""),
  tokenName: z.string().min(1).max(128),
  tokenSymbol: z
    .string()
    .min(1)
    .max(16)
    .transform((v) => v.toUpperCase()),
  tokenImageUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  const privyUser = await getAuthenticatedUser(req);
  if (!privyUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        twitterUsername: privyUser.twitter?.username ?? null,
        twitterName: privyUser.twitter?.name ?? null,
        twitterProfilePicture: privyUser.twitter?.profilePictureUrl ?? null,
      })
      .returning();
  }

  // Parse and validate input
  let body;
  try {
    body = launchSchema.parse(await req.json());
  } catch (e) {
    const messages =
      e instanceof ZodError
        ? e.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
        : ["Invalid input"];
    return NextResponse.json(
      { error: "Invalid input", details: messages },
      { status: 400 }
    );
  }

  // Rate limit: 1 launch per user per day
  const allowed = await checkRateLimit(dbUser.id);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. You can launch one token per day." },
      { status: 429 }
    );
  }

  // Insert pending launch
  const [launch] = await db
    .insert(launches)
    .values({
      launcherUserId: dbUser.id,
      targetTwitterUsername: body.targetTwitterUsername,
      targetTwitterName: body.targetTwitterName || null,
      targetTwitterProfilePicture: body.targetTwitterProfilePicture || null,
      tokenName: body.tokenName,
      tokenSymbol: body.tokenSymbol,
      tokenImageUrl: body.tokenImageUrl,
      status: "pending",
    })
    .returning();

  // Update to deploying
  await db
    .update(launches)
    .set({ status: "deploying" })
    .where(eq(launches.id, launch.id));

  try {
    const { txHash, tokenAddress, poolId, feeRouterAddress } =
      await deployToken({
        name: body.tokenName,
        symbol: body.tokenSymbol,
        imageUrl: body.tokenImageUrl,
      });

    // Update with deployment results
    const [deployed] = await db
      .update(launches)
      .set({
        status: "deployed",
        tokenAddress,
        deployTxHash: txHash,
        poolId,
        feeRouterAddress,
      })
      .where(eq(launches.id, launch.id))
      .returning();

    return NextResponse.json({ launch: deployed }, { status: 201 });
  } catch (error) {
    await db
      .update(launches)
      .set({ status: "failed" })
      .where(eq(launches.id, launch.id));

    console.error("Deploy failed:", error);
    return NextResponse.json(
      {
        error: "Token deployment failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
