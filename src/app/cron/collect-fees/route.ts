import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { launches, feeCollections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { collectPoolFees } from "@/lib/doppler";

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

  const results: {
    tokenAddress: string;
    success: boolean;
    fees0?: string;
    fees1?: string;
  }[] = [];

  for (const launch of deployedLaunches) {
    if (!launch.tokenAddress) continue;

    try {
      const { fees0, fees1, txHash } = await collectPoolFees(
        launch.tokenAddress as `0x${string}`
      );

      const totalFees = fees0 + fees1;

      if (txHash && totalFees > 0n) {
        await db.insert(feeCollections).values({
          launchId: launch.id,
          tokenAddress: launch.tokenAddress,
          amountWei: totalFees.toString(),
          txHash,
        });

        results.push({
          tokenAddress: launch.tokenAddress,
          success: true,
          fees0: fees0.toString(),
          fees1: fees1.toString(),
        });
      } else {
        results.push({
          tokenAddress: launch.tokenAddress,
          success: true,
          fees0: "0",
          fees1: "0",
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
    collected: results.filter(
      (r) => r.success && (r.fees0 !== "0" || r.fees1 !== "0")
    ).length,
    total: deployedLaunches.length,
    results,
  });
}
