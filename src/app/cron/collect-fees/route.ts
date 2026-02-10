import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { launches, feeCollections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { claimFees } from "@/lib/clanker";
import { getAdminAddress } from "@/lib/admin-wallet";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deployedLaunches = await db
    .select()
    .from(launches)
    .where(eq(launches.status, "deployed"));

  const results: { tokenAddress: string; success: boolean; amount?: string }[] =
    [];

  for (const launch of deployedLaunches) {
    if (!launch.tokenAddress) continue;

    try {
      // Claim fees for admin wallet (slot 1 = 10% platform revenue, always admin)
      const { txHash, amount } = await claimFees(
        launch.tokenAddress as `0x${string}`,
        getAdminAddress()
      );

      if (txHash && amount > 0n) {
        await db.insert(feeCollections).values({
          launchId: launch.id,
          tokenAddress: launch.tokenAddress,
          amountWei: amount.toString(),
          txHash,
        });

        results.push({
          tokenAddress: launch.tokenAddress,
          success: true,
          amount: amount.toString(),
        });
      } else {
        results.push({
          tokenAddress: launch.tokenAddress,
          success: true,
          amount: "0",
        });
      }
    } catch (error) {
      console.error(
        `Fee collection failed for ${launch.tokenAddress}:`,
        error
      );
      results.push({
        tokenAddress: launch.tokenAddress,
        success: false,
      });
    }
  }

  return NextResponse.json({
    collected: results.filter((r) => r.success && r.amount !== "0").length,
    total: deployedLaunches.length,
    results,
  });
}
