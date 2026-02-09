import { Spinner } from "@/design-system";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-[var(--space-20)]">
      <Spinner size="lg" />
    </div>
  );
}
