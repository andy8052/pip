import { Suspense } from "react";
import { DashboardTokens } from "@/components/dashboard-tokens";
import { VStack, Text, Spinner } from "@/design-system";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - pip",
  description:
    "View and claim tokens launched for your X profile.",
};

export default function DashboardPage() {
  return (
    <VStack gap="lg">
      <VStack gap="xs">
        <Text variant="h1">Your Dashboard</Text>
        <Text variant="body-sm">
          Tokens launched for your X profile appear here. Claim them to receive
          80% of trading fees and vesting tokens.
        </Text>
      </VStack>
      <Suspense
        fallback={
          <div className="flex justify-center py-[var(--space-8)]">
            <Spinner size="lg" label="Loading dashboard" />
          </div>
        }
      >
        <DashboardTokens />
      </Suspense>
    </VStack>
  );
}
