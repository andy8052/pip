"use client";

import Image from "next/image";
import type { TokenLaunch } from "@/types";
import {
  Card,
  Badge,
  Avatar,
  HStack,
  VStack,
  Text,
} from "@/design-system";

const statusVariantMap: Record<string, "warning" | "info" | "success" | "danger" | "default"> = {
  pending: "warning",
  deploying: "info",
  deployed: "success",
  failed: "danger",
};

function StatusBadge({ status }: { status: string }) {
  const variant = statusVariantMap[status] ?? "default";
  return <Badge variant={variant}>{status}</Badge>;
}

export function TokenCard({ launch }: { launch: TokenLaunch }) {
  return (
    <Card variant="default" padding="md">
      <VStack gap="sm">
        {/* Token identity row */}
        <HStack align="start" justify="between" className="gap-[var(--space-2)]">
          <HStack align="center" gap="sm" className="min-w-0 flex-1">
            <div className="shrink-0">
              {launch.tokenImageUrl ? (
                <Image
                  src={launch.tokenImageUrl}
                  alt={launch.tokenName}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <Avatar
                  size="md"
                  fallback={launch.tokenSymbol}
                />
              )}
            </div>
            <VStack gap="none" className="min-w-0">
              <Text variant="body" as="p" truncate className="font-[var(--font-medium)]">
                {launch.tokenName}{" "}
                <Text variant="body-sm" color="subtle" as="span">
                  ${launch.tokenSymbol}
                </Text>
              </Text>
              <Text variant="body-sm" as="p" truncate>
                for{" "}
                <a
                  href={`https://x.com/${launch.targetTwitterUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-default)] hover:underline underline-offset-4"
                >
                  @{launch.targetTwitterUsername}
                </a>
              </Text>
            </VStack>
          </HStack>
          <div className="shrink-0">
            <StatusBadge status={launch.status} />
          </div>
        </HStack>

        {/* Contract address — truncated on mobile, full on desktop */}
        {launch.tokenAddress && (
          <Text variant="caption" as="p" className="break-all sm:break-normal sm:truncate">
            <a
              href={`https://basescan.org/address/${launch.tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--fg-muted)] transition-colors duration-150"
            >
              {launch.tokenAddress}
            </a>
          </Text>
        )}

        {/* Metadata row */}
        <HStack align="center" gap="sm" wrap>
          {launch.claimed ? (
            <Text variant="caption" color="success" as="span">
              Claimed
            </Text>
          ) : (
            <Text variant="caption" as="span">
              Unclaimed
            </Text>
          )}
          <Text variant="caption" as="span">&middot;</Text>
          <Text variant="caption" as="span">
            {new Date(launch.createdAt).toLocaleDateString()}
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}
