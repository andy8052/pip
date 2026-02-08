import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, launches } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const privyUser = await getAuthenticatedUser(req);
  if (!privyUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const twitterUsername = privyUser.twitter?.username ?? null;
  const twitterName = privyUser.twitter?.name ?? null;
  const twitterProfilePicture = privyUser.twitter?.profilePictureUrl ?? null;

  // Upsert user in our DB
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.privyDid, privyUser.id))
    .limit(1);

  let dbUser;
  if (existing.length === 0) {
    const [inserted] = await db
      .insert(users)
      .values({
        privyDid: privyUser.id,
        twitterUsername,
        twitterName,
        twitterProfilePicture,
      })
      .returning();
    dbUser = inserted;
  } else {
    const [updated] = await db
      .update(users)
      .set({
        twitterUsername,
        twitterName,
        twitterProfilePicture,
      })
      .where(eq(users.privyDid, privyUser.id))
      .returning();
    dbUser = updated;
  }

  // Find tokens claimable by this user (target matches their twitter handle)
  let claimableTokens: (typeof launches.$inferSelect)[] = [];
  if (twitterUsername) {
    claimableTokens = await db
      .select()
      .from(launches)
      .where(eq(launches.targetTwitterUsername, twitterUsername));
  }

  return NextResponse.json({
    user: dbUser,
    claimableTokens,
  });
}
