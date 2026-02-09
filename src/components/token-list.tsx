"use client";

import { useEffect, useState } from "react";
import { TokenCard } from "./token-card";
import { EmptyState, Spinner } from "@/design-system";
import type { TokenLaunch } from "@/types";

export function TokenList() {
  const [tokens, setTokens] = useState<TokenLaunch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => setTokens(data.tokens ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-[var(--space-8)]">
        <Spinner size="lg" label="Loading tokens" />
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <EmptyState
        title="No tokens yet"
        description="No tokens launched yet. Be the first!"
      />
    );
  }

  return (
    <div className="grid gap-[var(--space-3)] sm:gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
      {tokens.map((token) => (
        <TokenCard key={token.id} launch={token} />
      ))}
    </div>
  );
}
