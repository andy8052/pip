"use client";

import type { TokenLaunch } from "@/types";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-900/50 text-yellow-400 border-yellow-800",
    deploying: "bg-blue-900/50 text-blue-400 border-blue-800",
    deployed: "bg-green-900/50 text-green-400 border-green-800",
    failed: "bg-red-900/50 text-red-400 border-red-800",
  };

  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs ${colors[status] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
    >
      {status}
    </span>
  );
}

export function TokenCard({ launch }: { launch: TokenLaunch }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {launch.tokenImageUrl ? (
            <img
              src={launch.tokenImageUrl}
              alt={launch.tokenName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm font-bold">
              {launch.tokenSymbol?.[0] ?? "?"}
            </div>
          )}
          <div>
            <p className="font-medium text-white">
              {launch.tokenName}{" "}
              <span className="text-zinc-500">${launch.tokenSymbol}</span>
            </p>
            <p className="text-sm text-zinc-500">
              for{" "}
              <a
                href={`https://x.com/${launch.targetTwitterUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                @{launch.targetTwitterUsername}
              </a>
            </p>
          </div>
        </div>
        <StatusBadge status={launch.status} />
      </div>

      {launch.tokenAddress && (
        <p className="text-xs text-zinc-500 break-all">
          <a
            href={`https://basescan.org/address/${launch.tokenAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            {launch.tokenAddress}
          </a>
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-zinc-600">
        {launch.claimed ? (
          <span className="text-green-500">Claimed</span>
        ) : (
          <span>Unclaimed</span>
        )}
        <span>&middot;</span>
        <span>{new Date(launch.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
