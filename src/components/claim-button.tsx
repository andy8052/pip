"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { TokenLaunch } from "@/types";
import {
  Button,
  Input,
  HStack,
  VStack,
  Text,
} from "@/design-system";

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
      <Text variant="body-sm" color="success" as="div" className="overflow-hidden">
        Claimed to{" "}
        <Text variant="code" as="span" className="break-all text-[var(--text-xs)]">
          {launch.claimerWalletAddress}
        </Text>
      </Text>
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
      <Button
        variant="success"
        size="sm"
        onClick={() => setShowForm(true)}
      >
        Claim Token
      </Button>
    );
  }

  return (
    <form onSubmit={handleClaim}>
      <VStack gap="sm">
        <Input
          type="text"
          placeholder="Your wallet address (0x...)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          inputSize="sm"
          pattern="^0x[a-fA-F0-9]{40}$"
          required
        />
        <HStack gap="sm">
          <Button
            type="submit"
            variant="success"
            size="sm"
            isLoading={loading}
          >
            {loading ? "Claiming..." : "Confirm Claim"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
        </HStack>
        {error && (
          <Text variant="caption" color="danger" as="p">
            {error}
          </Text>
        )}
      </VStack>
    </form>
  );
}
