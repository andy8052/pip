import { db } from "./db";
import { launches } from "./db/schema";
import { eq, and, gte } from "drizzle-orm";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function checkRateLimit(userId: string): Promise<boolean> {
  const oneDayAgo = new Date(Date.now() - ONE_DAY_MS);

  const recentLaunches = await db
    .select({ id: launches.id })
    .from(launches)
    .where(
      and(
        eq(launches.launcherUserId, userId),
        gte(launches.createdAt, oneDayAgo)
      )
    )
    .limit(1);

  return recentLaunches.length === 0;
}
