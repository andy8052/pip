import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { launches } from "@/lib/db/schema";
import { desc, sql, eq } from "drizzle-orm";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );
  const offset = (page - 1) * limit;

  // Only return successfully deployed tokens in the public listing
  const deployedFilter = eq(launches.status, "deployed");

  const [tokens, countResult] = await Promise.all([
    db
      .select()
      .from(launches)
      .where(deployedFilter)
      .orderBy(desc(launches.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(launches).where(deployedFilter),
  ]);

  const total = Number(countResult[0]?.count ?? 0);

  return NextResponse.json({
    tokens,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
