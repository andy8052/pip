import { Button, EmptyState, Text } from "@/design-system";
import Link from "next/link";

export default function NotFound() {
  return (
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
  );
}
