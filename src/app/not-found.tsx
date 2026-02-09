import { Button, EmptyState } from "@/design-system";
import Link from "next/link";

export default function NotFound() {
  return (
    <EmptyState
      icon={
        <span className="text-[var(--text-5xl)] font-[var(--font-bold)] text-[var(--fg-default)]">
          404
        </span>
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
