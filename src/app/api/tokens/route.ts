import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { launches } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const tokens = await db
    .select()
    .from(launches)
    .orderBy(desc(launches.createdAt))
    .limit(50);

  return NextResponse.json({ tokens });
}
