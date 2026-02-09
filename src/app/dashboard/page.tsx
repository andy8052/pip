import { Suspense } from "react";
import { DashboardTokens } from "@/components/dashboard-tokens";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - pip",
  description:
    "View and claim tokens launched for your X profile.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
      <p className="text-zinc-400">
        Tokens launched for your X profile appear here. Claim them to receive
        80% of trading fees and vesting tokens.
      </p>
      <Suspense
        fallback={
          <div className="text-center text-zinc-500 py-8">Loading...</div>
        }
      >
        <DashboardTokens />
      </Suspense>
    </div>
  );
}
