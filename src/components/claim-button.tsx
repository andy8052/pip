"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { TokenLaunch } from "@/types";

interface ClaimButtonProps {
  launch: TokenLaunch;
  onClaimed: () => void;
}

export function ClaimButton({ launch, onClaimed }: ClaimButtonProps) {
  const { getAccessToken } = usePrivy();
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (launch.claimed) {
    return (
      <div className="text-sm text-green-500">
        Claimed to{" "}
        <span className="font-mono text-xs break-all">
          {launch.claimerWalletAddress}
        </span>
      </div>
    );
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          launchId: launch.id,
          walletAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Claim failed");
      }

      onClaimed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500 transition-colors"
      >
        Claim Token
      </button>
    );
  }

  return (
    <form onSubmit={handleClaim} className="space-y-2">
      <input
        type="text"
        placeholder="Your wallet address (0x...)"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        pattern="^0x[a-fA-F0-9]{40}$"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Claiming..." : "Confirm Claim"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
