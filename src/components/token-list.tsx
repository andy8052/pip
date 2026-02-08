"use client";

import { useEffect, useState } from "react";
import { TokenCard } from "./token-card";
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
      <div className="text-center text-zinc-500 py-8">Loading tokens...</div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center text-zinc-500 py-8">
        No tokens launched yet. Be the first!
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tokens.map((token) => (
        <TokenCard key={token.id} launch={token} />
      ))}
    </div>
  );
}
