import { Skeleton, VStack } from "@/design-system";

export default function DashboardLoading() {
  return (
    <VStack gap="lg">
      <Skeleton className="h-8 w-32 sm:w-48" />
      <Skeleton className="h-4 w-full max-w-xs sm:max-w-sm" />
      <div className="grid gap-[var(--space-3)] sm:gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-36 rounded-[var(--radius-xl)]"
          />
        ))}
      </div>
    </VStack>
  );
}
