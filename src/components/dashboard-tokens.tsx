"use client";

import { useEffect, useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { TokenCard } from "./token-card";
import { ClaimButton } from "./claim-button";
import {
  Text,
  VStack,
  Spinner,
  EmptyState,
} from "@/design-system";
import type { TokenLaunch, AppUser } from "@/types";

export function DashboardTokens() {
  const { authenticated, getAccessToken } = usePrivy();
  const [user, setUser] = useState<AppUser | null>(null);
  const [claimableTokens, setClaimableTokens] = useState<TokenLaunch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setClaimableTokens(data.claimableTokens ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!authenticated) {
    return (
      <EmptyState
        description="Sign in with X to see your claimable tokens."
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-[var(--space-8)]">
        <Spinner size="lg" label="Loading dashboard" />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        description="Unable to load user data."
      />
    );
  }

  const unclaimedTokens = claimableTokens.filter((t) => !t.claimed);
  const claimedTokens = claimableTokens.filter((t) => t.claimed);

  return (
    <VStack gap="xl">
      <Text variant="body-sm" as="p">
        Signed in as{" "}
        <Text variant="body" as="span" className="font-[var(--font-medium)]">
          @{user.twitterUsername}
        </Text>
      </Text>

      {unclaimedTokens.length > 0 && (
        <VStack gap="md">
          <Text variant="h3">Tokens Available to Claim</Text>
          <div className="grid gap-[var(--space-3)] sm:gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
            {unclaimedTokens.map((token) => (
              <VStack key={token.id} gap="sm">
                <TokenCard launch={token} />
                <ClaimButton launch={token} onClaimed={fetchData} />
              </VStack>
            ))}
          </div>
        </VStack>
      )}

      {claimedTokens.length > 0 && (
        <VStack gap="md">
          <Text variant="h3">Claimed Tokens</Text>
          <div className="grid gap-[var(--space-3)] sm:gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
            {claimedTokens.map((token) => (
              <VStack key={token.id} gap="sm">
                <TokenCard launch={token} />
                <ClaimButton launch={token} onClaimed={fetchData} />
              </VStack>
            ))}
          </div>
        </VStack>
      )}

      {claimableTokens.length === 0 && (
        <EmptyState
          description="No tokens have been launched for your X profile yet."
        />
      )}
    </VStack>
  );
}
