import { Skeleton, VStack } from "@/design-system";

export default function DashboardLoading() {
  return (
    <VStack gap="lg">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-80" />
      <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
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
