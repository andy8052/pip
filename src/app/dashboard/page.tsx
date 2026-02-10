import { Suspense } from "react";
import { DashboardTokens } from "@/components/dashboard-tokens";
import { VStack, Text, Spinner, Container } from "@/design-system";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - pip",
  description:
    "View and claim tokens launched for your X profile.",
};

export default function DashboardPage() {
  return (
    <Container className="py-[var(--space-4)] sm:py-[var(--space-6)] lg:py-[var(--space-8)]">
      <VStack gap="lg">
        <VStack gap="xs">
          <Text variant="h1">Your Dashboard</Text>
          <Text variant="body-sm">
            Tokens launched for your X profile appear here. Claim them to receive
            the majority of trading fees and vested tokens.
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
    </Container>
  );
}
