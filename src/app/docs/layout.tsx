import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — pip",
  description:
    "In-depth documentation for the pip platform. Learn how token launching, fee sharing, vesting, and the $PIPAI buy & burn mechanism work.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
