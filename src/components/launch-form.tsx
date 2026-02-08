"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface LaunchResult {
  tokenAddress?: string;
  tokenName?: string;
  tokenSymbol?: string;
  deployTxHash?: string;
}

export function LaunchForm() {
  const { authenticated, getAccessToken, login } = usePrivy();
  const [targetHandle, setTargetHandle] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenImageUrl, setTokenImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authenticated) {
      login();
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await getAccessToken();
      const res = await fetch("/api/launch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetTwitterUsername: targetHandle.replace(/^@/, ""),
          tokenName,
          tokenSymbol,
          tokenImageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Launch failed");
      }

      setResult({
        tokenAddress: data.launch.tokenAddress,
        tokenName: data.launch.tokenName,
        tokenSymbol: data.launch.tokenSymbol,
        deployTxHash: data.launch.deployTxHash,
      });

      // Reset form
      setTargetHandle("");
      setTokenName("");
      setTokenSymbol("");
      setTokenImageUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="targetHandle"
            className="block text-sm font-medium text-zinc-400 mb-1"
          >
            X Profile Handle
          </label>
          <input
            id="targetHandle"
            type="text"
            placeholder="@elonmusk"
            value={targetHandle}
            onChange={(e) => setTargetHandle(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tokenName"
            className="block text-sm font-medium text-zinc-400 mb-1"
          >
            Token Name
          </label>
          <input
            id="tokenName"
            type="text"
            placeholder="Elon Coin"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
            maxLength={128}
          />
        </div>
        <div>
          <label
            htmlFor="tokenSymbol"
            className="block text-sm font-medium text-zinc-400 mb-1"
          >
            Token Symbol
          </label>
          <input
            id="tokenSymbol"
            type="text"
            placeholder="ELON"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
            maxLength={16}
          />
        </div>
        <div>
          <label
            htmlFor="tokenImageUrl"
            className="block text-sm font-medium text-zinc-400 mb-1"
          >
            Token Image URL
          </label>
          <input
            id="tokenImageUrl"
            type="url"
            placeholder="https://example.com/image.png"
            value={tokenImageUrl}
            onChange={(e) => setTokenImageUrl(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "Deploying..."
            : authenticated
              ? "Launch Token"
              : "Sign in to Launch"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-green-800 bg-green-950/50 p-4 space-y-2">
          <p className="font-medium text-green-400">Token launched!</p>
          <p className="text-sm text-zinc-400">
            <span className="text-zinc-500">Name:</span> {result.tokenName} ($
            {result.tokenSymbol})
          </p>
          {result.tokenAddress && (
            <p className="text-sm text-zinc-400 break-all">
              <span className="text-zinc-500">Address:</span>{" "}
              <a
                href={`https://basescan.org/address/${result.tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {result.tokenAddress}
              </a>
            </p>
          )}
          {result.deployTxHash && (
            <p className="text-sm text-zinc-400 break-all">
              <span className="text-zinc-500">Tx:</span>{" "}
              <a
                href={`https://basescan.org/tx/${result.deployTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {result.deployTxHash}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
