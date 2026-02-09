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
        <HStack align="start" justify="between">
          <HStack align="center" gap="sm">
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
            <VStack gap="none">
              <Text variant="body" as="p" className="font-[var(--font-medium)]">
                {launch.tokenName}{" "}
                <Text variant="body-sm" color="subtle" as="span">
                  ${launch.tokenSymbol}
                </Text>
              </Text>
              <Text variant="body-sm" as="p">
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
          <StatusBadge status={launch.status} />
        </HStack>

        {launch.tokenAddress && (
          <Text variant="caption" as="p" className="break-all">
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

        <HStack align="center" gap="sm">
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
