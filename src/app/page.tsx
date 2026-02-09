import Link from "next/link";
import {
  Button,
  Badge,
  Card,
  CardContent,
  VStack,
  HStack,
  Text,
  Container,
  Separator,
} from "@/design-system";

/* ─────────────────────────────────────────────────────────────────────────────
 * ICONS — Inline SVGs to avoid extra dependencies.
 * Kept as small server components for zero client JS overhead.
 * ────────────────────────────────────────────────────────────────────────── */

function IconProfile({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconRocket({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconCoins({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconZap({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function IconTrendingUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function IconLink({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * DATA — Static content for landing page sections.
 * ────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    number: "01",
    title: "Pick an X profile",
    description:
      "Enter any X (Twitter) handle. The token will be created for that profile — they don't need to sign up first.",
    icon: IconProfile,
  },
  {
    number: "02",
    title: "Configure your token",
    description:
      "Choose a name, ticker symbol, and image. Customize your token's identity in seconds.",
    icon: IconRocket,
  },
  {
    number: "03",
    title: "Launch & earn",
    description:
      "Deploy on Base via Clanker v4. The profile owner receives 10% of the total supply vested over time, plus 80% of all trading fees — claimable at any time.",
    icon: IconCoins,
  },
] as const;

const FEATURES = [
  {
    icon: IconZap,
    title: "Instant deployment",
    description:
      "Tokens deploy in a single transaction on Base. No waiting, no complex setup — just launch and go.",
  },
  {
    icon: IconLock,
    title: "10% vested for creators",
    description:
      "10% of every token's supply is reserved and vested for the X profile it's created for. Aligned incentives from day one — creators earn as the community grows.",
  },
  {
    icon: IconTrendingUp,
    title: "80% fee sharing",
    description:
      "On top of vested tokens, profile owners claim 80% of all trading fees. Fair economics that reward the people tokens are created for.",
  },
  {
    icon: IconLink,
    title: "Fully on-chain",
    description:
      "Built on Clanker v4, everything runs on Base L2 — transparent, verifiable, and permissionless. No centralized points of failure.",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
 * PAGE
 * ────────────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient background orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[var(--color-primary-500)] opacity-[0.07] blur-[120px]" />
          <div className="absolute top-60 -left-40 h-[300px] w-[400px] rounded-full bg-[var(--color-primary-700)] opacity-[0.05] blur-[100px]" />
          <div className="absolute top-40 -right-40 h-[300px] w-[400px] rounded-full bg-[var(--color-info-700)] opacity-[0.04] blur-[100px]" />
        </div>

        <Container className="relative pt-[var(--space-16)] pb-[var(--space-16)] sm:pt-[var(--space-24)] sm:pb-[var(--space-24)]">
          <VStack align="center" gap="lg" className="text-center">
            <Badge variant="primary" className="text-[var(--text-xs)]">
              Powered by Clanker v4 on Base
            </Badge>

            <VStack align="center" gap="md" className="max-w-3xl">
              <Text
                variant="display"
                align="center"
                className="bg-gradient-to-b from-[var(--fg-default)] via-[var(--fg-default)] to-[var(--fg-muted)] bg-clip-text text-transparent"
              >
                Launch tokens for
                <br />
                any X profile
              </Text>

              <Text
                variant="body"
                color="muted"
                align="center"
                className="max-w-xl text-[var(--text-lg)] leading-[var(--leading-relaxed)]"
              >
                Create a token for anyone on X in seconds. The profile owner
                gets 10% of the supply vested to them plus 80% of all trading
                fees — no sign-up required.
              </Text>
            </VStack>

            <HStack
              gap="sm"
              align="center"
              justify="center"
              wrap
              className="pt-[var(--space-2)]"
            >
              <Link href="/launch">
                <Button variant="primary" size="lg">
                  Launch a Token
                  <IconArrowRight />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg">
                  How it works
                </Button>
              </a>
            </HStack>

            {/* Hero visual — stylized token card preview */}
            <div className="relative mt-[var(--space-8)] w-full max-w-lg">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[var(--radius-2xl)] bg-gradient-to-b from-[var(--accent-subtle)] to-transparent opacity-50"
              />
              <Card
                variant="elevated"
                padding="lg"
                className="relative border-[var(--border-strong)] bg-[var(--bg-surface)]"
              >
                <CardContent>
                  <VStack gap="md">
                    <HStack align="center" gap="sm">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-info-500)]">
                        <Text
                          variant="body"
                          as="span"
                          className="font-[var(--font-bold)] text-white"
                        >
                          P
                        </Text>
                      </div>
                      <VStack gap="none">
                        <Text variant="body" className="font-[var(--font-semibold)]">
                          Example Token
                        </Text>
                        <Text variant="body-sm" color="subtle">
                          $EXAMPLE
                        </Text>
                      </VStack>
                      <Badge variant="success" className="ml-auto">
                        Deployed
                      </Badge>
                    </HStack>

                    <Separator />

                    <div className="grid grid-cols-2 gap-[var(--space-4)] sm:grid-cols-4">
                      <VStack gap="none" align="center">
                        <Text variant="caption" color="subtle">
                          For
                        </Text>
                        <Text
                          variant="body-sm"
                          className="font-[var(--font-medium)] text-[var(--accent-default)]"
                        >
                          @creator
                        </Text>
                      </VStack>
                      <VStack gap="none" align="center">
                        <Text variant="caption" color="subtle">
                          Vested supply
                        </Text>
                        <Text
                          variant="body-sm"
                          className="font-[var(--font-medium)] text-[var(--color-warning-400)]"
                        >
                          10%
                        </Text>
                      </VStack>
                      <VStack gap="none" align="center">
                        <Text variant="caption" color="subtle">
                          Fee share
                        </Text>
                        <Text
                          variant="body-sm"
                          className="font-[var(--font-medium)] text-[var(--status-success)]"
                        >
                          80%
                        </Text>
                      </VStack>
                      <VStack gap="none" align="center">
                        <Text variant="caption" color="subtle">
                          Network
                        </Text>
                        <Text
                          variant="body-sm"
                          className="font-[var(--font-medium)]"
                        >
                          Base
                        </Text>
                      </VStack>
                    </div>
                  </VStack>
                </CardContent>
              </Card>
            </div>
          </VStack>
        </Container>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-16 bg-[var(--bg-subtle)]">
        <Container className="py-[var(--space-16)] sm:py-[var(--space-24)]">
          <VStack gap="xl" className="sm:gap-[var(--space-16)]">
            <VStack align="center" gap="sm" className="text-center">
              <Text variant="overline" color="accent" as="span">
                How it works
              </Text>
              <Text variant="h2" align="center">
                Three steps to launch
              </Text>
              <Text
                variant="body"
                color="muted"
                align="center"
                className="max-w-lg"
              >
                No smart contract knowledge needed. Pick a profile, configure
                your token, and deploy — all from your browser.
              </Text>
            </VStack>

            <div className="grid gap-[var(--space-6)] sm:gap-[var(--space-8)] md:grid-cols-3">
              {STEPS.map((step) => (
                <Card
                  key={step.number}
                  variant="default"
                  padding="lg"
                  className="relative overflow-hidden"
                >
                  <CardContent>
                    <VStack gap="md">
                      <div className="flex size-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--accent-subtle)]">
                        <step.icon className="size-6 text-[var(--accent-default)]" />
                      </div>
                      <VStack gap="xs">
                        <HStack align="center" gap="sm">
                          <Text
                            variant="caption"
                            className="font-[var(--font-mono)] text-[var(--accent-default)]"
                            as="span"
                          >
                            {step.number}
                          </Text>
                          <Text variant="h4">{step.title}</Text>
                        </HStack>
                        <Text variant="body-sm">{step.description}</Text>
                      </VStack>
                    </VStack>
                  </CardContent>
                  {/* Decorative step number watermark */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-4 -right-2 text-[6rem] font-[var(--font-bold)] leading-none text-[var(--fg-default)] opacity-[0.03] select-none"
                  >
                    {step.number}
                  </span>
                </Card>
              ))}
            </div>
          </VStack>
        </Container>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section>
        <Container className="py-[var(--space-16)] sm:py-[var(--space-24)]">
          <VStack gap="xl" className="sm:gap-[var(--space-16)]">
            <VStack align="center" gap="sm" className="text-center">
              <Text variant="overline" color="accent" as="span">
                Why pip
              </Text>
              <Text variant="h2" align="center">
                Built for speed, fairness, and trust
              </Text>
              <Text
                variant="body"
                color="muted"
                align="center"
                className="max-w-lg"
              >
                Every design decision optimizes for a fair launch experience
                where creators are rewarded and communities can thrive.
              </Text>
            </VStack>

            <div className="grid gap-[var(--space-4)] sm:gap-[var(--space-6)] sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  variant="default"
                  padding="lg"
                  className="group transition-all duration-200 hover:border-[var(--border-strong)]"
                >
                  <CardContent>
                    <HStack gap="md" align="start">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-subtle)] transition-colors duration-200 group-hover:bg-[var(--accent-muted)]">
                        <feature.icon className="size-5 text-[var(--accent-default)]" />
                      </div>
                      <VStack gap="xs">
                        <Text variant="h4">{feature.title}</Text>
                        <Text variant="body-sm">{feature.description}</Text>
                      </VStack>
                    </HStack>
                  </CardContent>
                </Card>
              ))}
            </div>
          </VStack>
        </Container>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border-default)] bg-[var(--bg-subtle)]">
        <Container className="py-[var(--space-10)] sm:py-[var(--space-12)]">
          <div className="grid grid-cols-2 gap-[var(--space-8)] sm:grid-cols-4">
            {[
              { value: "10%", label: "Supply vested for creator" },
              { value: "80%", label: "Trading fees to creator" },
              { value: "1-click", label: "Token deployment" },
              { value: "Base L2", label: "Fast & low cost" },
            ].map((stat) => (
              <VStack key={stat.label} align="center" gap="xs">
                <Text
                  variant="h2"
                  align="center"
                  className="bg-gradient-to-b from-[var(--fg-default)] to-[var(--fg-muted)] bg-clip-text text-transparent"
                >
                  {stat.value}
                </Text>
                <Text variant="caption" align="center">
                  {stat.label}
                </Text>
              </VStack>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[var(--color-primary-600)] opacity-[0.06] blur-[120px]" />
        </div>

        <Container className="relative py-[var(--space-16)] sm:py-[var(--space-24)]">
          <Card
            variant="elevated"
            padding="lg"
            className="border-[var(--border-strong)] bg-[var(--bg-surface)]"
          >
            <CardContent>
              <VStack
                align="center"
                gap="lg"
                className="py-[var(--space-4)] sm:py-[var(--space-8)] text-center"
              >
                <VStack align="center" gap="sm">
                  <Text variant="h2" align="center">
                    Ready to launch?
                  </Text>
                  <Text
                    variant="body"
                    color="muted"
                    align="center"
                    className="max-w-md"
                  >
                    Create a token for any X profile in under a minute. No
                    coding required — just connect, configure, and deploy.
                  </Text>
                </VStack>
                <Link href="/launch">
                  <Button variant="primary" size="lg">
                    Launch your first token
                    <IconArrowRight />
                  </Button>
                </Link>
              </VStack>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
