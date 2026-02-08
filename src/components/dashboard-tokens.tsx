"use client";

import { useEffect, useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { TokenCard } from "./token-card";
import { ClaimButton } from "./claim-button";
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
      <div className="text-center text-zinc-500 py-8">
        Sign in with X to see your claimable tokens.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-zinc-500 py-8">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-zinc-500 py-8">
        Unable to load user data.
      </div>
    );
  }

  const unclaimedTokens = claimableTokens.filter((t) => !t.claimed);
  const claimedTokens = claimableTokens.filter((t) => t.claimed);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-zinc-400">
          Signed in as{" "}
          <span className="text-white font-medium">
            @{user.twitterUsername}
          </span>
        </p>
      </div>

      {unclaimedTokens.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Tokens Available to Claim
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {unclaimedTokens.map((token) => (
              <div key={token.id} className="space-y-3">
                <TokenCard launch={token} />
                <ClaimButton launch={token} onClaimed={fetchData} />
              </div>
            ))}
          </div>
        </div>
      )}

      {claimedTokens.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Claimed Tokens
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {claimedTokens.map((token) => (
              <div key={token.id} className="space-y-3">
                <TokenCard launch={token} />
                <ClaimButton launch={token} onClaimed={fetchData} />
              </div>
            ))}
          </div>
        </div>
      )}

      {claimableTokens.length === 0 && (
        <div className="text-center text-zinc-500 py-8">
          No tokens have been launched for your X profile yet.
        </div>
      )}
    </div>
  );
}
