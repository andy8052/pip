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
        <HStack align="center" justify="between" className="py-[var(--space-3)]">
          <HStack align="center" gap="lg">
            <Link href="/" className="no-underline">
              <Logo size="md" />
            </Link>
            {authenticated && (
              <AppLink href="/dashboard" variant="nav">
                Dashboard
              </AppLink>
            )}
          </HStack>

          <HStack align="center" gap="sm">
            {authenticated ? (
              <>
                {twitterUsername && (
                  <Text variant="body-sm" color="muted" as="span">
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
