"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

export function Header() {
  const { login, logout, authenticated, user } = usePrivy();
  const twitterUsername = user?.twitter?.username;

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-white">
            pip
          </Link>
          {authenticated && (
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          {authenticated ? (
            <>
              {twitterUsername && (
                <span className="text-sm text-zinc-400">
                  @{twitterUsername}
                </span>
              )}
              <button
                onClick={logout}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Sign in with X
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
