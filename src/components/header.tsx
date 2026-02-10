"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import {
  Button,
  Logo,
  HStack,
  Container,
  Text,
  AppLink,
} from "@/design-system";

export function Header() {
  const { login, logout, authenticated, user } = usePrivy();
  const twitterUsername = user?.twitter?.username;

  return (
    <header className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)]">
      <Container>
        <HStack align="center" justify="between" className="py-[var(--space-3)] min-h-[48px]">
          <HStack align="center" gap="sm" className="sm:gap-[var(--space-6)]">
            <Link href="/" className="no-underline">
              <Logo size="md" />
            </Link>
            <nav>
              <HStack align="center" gap="xs" className="sm:gap-[var(--space-4)]">
                <AppLink href="/launch" variant="nav">
                  Launch
                </AppLink>
                <AppLink href="/docs" variant="nav">
                  Docs
                </AppLink>
                {authenticated && (
                  <AppLink href="/dashboard" variant="nav">
                    Dashboard
                  </AppLink>
                )}
              </HStack>
            </nav>
          </HStack>

          <HStack align="center" gap="sm">
            {authenticated ? (
              <>
                {twitterUsername && (
                  <Text
                    variant="body-sm"
                    color="muted"
                    as="span"
                    truncate
                    className="hidden sm:inline max-w-[120px] md:max-w-none"
                  >
                    @{twitterUsername}
                  </Text>
                )}
                <Button variant="secondary" size="sm" onClick={logout}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={login}>
                Sign in with X
              </Button>
            )}
          </HStack>
        </HStack>
      </Container>
    </header>
  );
}
