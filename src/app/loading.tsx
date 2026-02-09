import { Spinner, Container } from "@/design-system";

export default function Loading() {
  return (
    <Container>
      <div className="flex items-center justify-center py-[var(--space-20)]">
        <Spinner size="lg" />
      </div>
    </Container>
  );
}
