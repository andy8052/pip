import { Button, EmptyState, Text, Container } from "@/design-system";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className="py-[var(--space-8)]">
      <EmptyState
        icon={
          <Text variant="display" as="span">
            404
          </Text>
        }
        description="The page you are looking for does not exist."
        action={
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
        }
      />
    </Container>
  );
}
