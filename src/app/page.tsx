import { Suspense } from "react";
import { LaunchForm } from "@/components/launch-form";
import { TokenList } from "@/components/token-list";
import { VStack, Text, Skeleton } from "@/design-system";

export default function Home() {
  return (
    <VStack gap="xl" className="sm:gap-[var(--space-12)]">
      <VStack align="center" gap="sm" className="pt-[var(--space-4)] sm:pt-[var(--space-8)] sm:gap-[var(--space-4)] text-center">
        <Text variant="display">pip</Text>
        <Text variant="body-sm" className="max-w-lg px-[var(--space-2)]" align="center">
          Launch a Clanker v4 token on Base for any X profile. The profile owner
          can claim 80% of trading fees + vesting tokens.
        </Text>
      </VStack>

      <section className="flex justify-center">
        <Suspense
          fallback={
            <Skeleton className="h-80 w-full max-w-md rounded-[var(--radius-xl)]" />
          }
        >
          <LaunchForm />
        </Suspense>
      </section>

      <VStack gap="md">
        <Text variant="h3">Recently Launched</Text>
        <Suspense
          fallback={
            <div className="flex justify-center py-[var(--space-8)]">
              <Text variant="body-sm" color="subtle">Loading tokens...</Text>
            </div>
          }
        >
          <TokenList />
        </Suspense>
      </VStack>
    </VStack>
  );
}
