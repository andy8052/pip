import Link from "next/link";
import {
  Container,
  HStack,
  VStack,
  Text,
  Separator,
  Logo,
} from "@/design-system";
import { PIPAI_TOKEN_URL, PIPAI_DEXSCREENER_URL } from "@/lib/contracts";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-subtle)]">
      <Container className="py-[var(--space-8)] sm:py-[var(--space-10)]">
        <VStack gap="lg">
          <div className="flex flex-col gap-[var(--space-6)] sm:flex-row sm:items-start sm:justify-between">
            {/* Brand column */}
            <VStack gap="xs" className="max-w-xs">
              <Link href="/" className="no-underline">
                <Logo size="md" />
              </Link>
              <Text variant="body-sm">
                Launch tokens for any X profile on Base. Fair economics,
                instant deployment, fully on-chain.
              </Text>
            </VStack>

            {/* Links */}
            <HStack gap="xl" className="flex-wrap">
              <VStack gap="sm">
                <Text variant="label" className="text-[var(--fg-subtle)]">
                  Product
                </Text>
                <VStack gap="xs">
                  <Link
                    href="/launch"
                    className="text-[var(--text-sm)] text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg-default)] no-underline"
                  >
                    Launch Token
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-[var(--text-sm)] text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg-default)] no-underline"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/docs"
                    className="text-[var(--text-sm)] text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg-default)] no-underline"
                  >
                    Documentation
                  </Link>
                </VStack>
              </VStack>

              <VStack gap="sm">
                <Text variant="label" className="text-[var(--fg-subtle)]">
                  $PIPAI Token
                </Text>
                <VStack gap="xs">
                  <a
                    href={PIPAI_TOKEN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-sm)] text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg-default)] no-underline"
                  >
                    Basescan
                  </a>
                  <a
                    href={PIPAI_DEXSCREENER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-sm)] text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg-default)] no-underline"
                  >
                    DEX Screener
                  </a>
                </VStack>
              </VStack>

              <VStack gap="sm">
                <Text variant="label" className="text-[var(--fg-subtle)]">
                  Resources
                </Text>
                <VStack gap="xs">
                  <a
                    href="https://www.clanker.world"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-sm)] text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg-default)] no-underline"
                  >
                    Clanker
                  </a>
                  <a
                    href="https://base.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-sm)] text-[var(--fg-muted)] transition-colors duration-150 hover:text-[var(--fg-default)] no-underline"
                  >
                    Base
                  </a>
                </VStack>
              </VStack>
            </HStack>
          </div>

          <Separator />

          <HStack
            align="center"
            justify="between"
            className="flex-col gap-[var(--space-2)] sm:flex-row"
          >
            <Text variant="caption">
              &copy; {new Date().getFullYear()} pip. All rights reserved.
            </Text>
            <Text variant="caption">
              Built on{" "}
              <a
                href="https://base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--fg-subtle)] hover:text-[var(--fg-muted)] transition-colors duration-150 underline underline-offset-4"
              >
                Base
              </a>
            </Text>
          </HStack>
        </VStack>
      </Container>
    </footer>
  );
}
