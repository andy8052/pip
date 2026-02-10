import Link from "next/link";
import {
  Text,
  VStack,
  HStack,
  Card,
  CardContent,
  Badge,
  Separator,
  Button,
} from "@/design-system";
import { CONTRACTS, PIPAI_TOKEN_URL, PIPAI_DEXSCREENER_URL } from "@/lib/contracts";
import { DocsSidebar } from "@/components/docs-sidebar";

/* ─────────────────────────────────────────────────────────────────────────────
 * SIDEBAR SECTION STRUCTURE
 * ────────────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    children: [
      { id: "what-is-pip", title: "What is pip?" },
      { id: "key-concepts", title: "Key Concepts" },
    ],
  },
  {
    id: "how-it-works",
    title: "How It Works",
    children: [
      { id: "token-creation-flow", title: "Token Creation Flow" },
      { id: "smart-contract-deployment", title: "Smart Contract Deployment" },
      { id: "liquidity-pool", title: "Liquidity Pool" },
    ],
  },
  {
    id: "fee-structure",
    title: "Fee Structure",
    children: [
      { id: "fee-split", title: "80/20 Fee Split" },
      { id: "fee-collection", title: "Fee Collection" },
      { id: "claiming-fees", title: "Claiming Fees" },
    ],
  },
  {
    id: "token-vesting",
    title: "Token Vesting",
    children: [
      { id: "vesting-mechanism", title: "Vesting Mechanism" },
      { id: "vesting-schedule", title: "Vesting Schedule" },
      { id: "claiming-vested-tokens", title: "Claiming Vested Tokens" },
    ],
  },
  {
    id: "pipai-token",
    title: "$PIPAI Token",
    children: [
      { id: "buy-and-burn", title: "Buy & Burn Mechanics" },
      { id: "deflationary-model", title: "Deflationary Model" },
      { id: "token-details", title: "Token Details" },
    ],
  },
  {
    id: "technical-architecture",
    title: "Technical Architecture",
    children: [
      { id: "clanker-v4", title: "Clanker v4 Protocol" },
      { id: "base-l2", title: "Base L2 Network" },
      { id: "contract-addresses", title: "Contract Addresses" },
    ],
  },
  {
    id: "for-creators",
    title: "For Creators",
    children: [
      { id: "getting-started", title: "Getting Started" },
      { id: "claiming-your-token", title: "Claiming Your Token" },
      { id: "managing-fees", title: "Managing Fees" },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * INLINE ICONS — zero client-JS overhead
 * ────────────────────────────────────────────────────────────────────────── */

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconExternalLink({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * REUSABLE DOC COMPONENTS
 * ────────────────────────────────────────────────────────────────────────── */

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-20 text-[var(--text-xl)] sm:text-[var(--text-2xl)] font-[var(--font-bold)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--fg-default)] pt-[var(--space-8)] sm:pt-[var(--space-12)] first:pt-0"
    >
      {children}
    </h2>
  );
}

function SubHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="scroll-mt-20 text-[var(--text-lg)] sm:text-[var(--text-xl)] font-[var(--font-semibold)] leading-[var(--leading-snug)] text-[var(--fg-default)] pt-[var(--space-6)] sm:pt-[var(--space-8)]"
    >
      {children}
    </h3>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[var(--text-sm)] sm:text-[var(--text-base)] font-[var(--font-normal)] leading-[var(--leading-relaxed)] text-[var(--fg-muted)]">
      {children}
    </p>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[var(--radius-sm)] bg-[var(--bg-overlay)] px-[var(--space-1-5)] py-[var(--space-0-5)] font-[var(--font-family-mono)] text-[0.85em] text-[var(--fg-default)] break-words">
      {children}
    </code>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="-mx-[var(--space-4)] sm:mx-0 overflow-hidden sm:rounded-[var(--radius-lg)] border-y sm:border border-[var(--border-default)] bg-[var(--bg-raised)]">
      {title && (
        <div className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)] px-[var(--space-4)] py-[var(--space-2)]">
          <span className="font-[var(--font-family-mono)] text-[var(--text-xs)] text-[var(--fg-subtle)]">
            {title}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto p-[var(--space-3)] sm:p-[var(--space-4)]">
        <code className="font-[var(--font-family-mono)] text-[var(--text-xs)] sm:text-[var(--text-sm)] leading-[var(--leading-relaxed)] text-[var(--fg-muted)]">
          {children}
        </code>
      </pre>
    </div>
  );
}

function Callout({ type = "info", title, children }: { type?: "info" | "warning" | "tip"; title?: string; children: React.ReactNode }) {
  const styles = {
    info: {
      border: "border-[var(--status-info-border)]",
      bg: "bg-[var(--status-info-bg)]",
      accent: "text-[var(--status-info)]",
      icon: "i",
    },
    warning: {
      border: "border-[var(--status-warning-border)]",
      bg: "bg-[var(--status-warning-bg)]",
      accent: "text-[var(--status-warning)]",
      icon: "!",
    },
    tip: {
      border: "border-[var(--status-success-border)]",
      bg: "bg-[var(--status-success-bg)]",
      accent: "text-[var(--status-success)]",
      icon: "✓",
    },
  };
  const s = styles[type];

  return (
    <div className={`rounded-[var(--radius-lg)] border ${s.border} ${s.bg} p-[var(--space-3)] sm:p-[var(--space-4)]`}>
      {title && (
        <div className={`mb-[var(--space-2)] flex items-center gap-[var(--space-2)] font-[var(--font-semibold)] text-[var(--text-sm)] ${s.accent}`}>
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-[0.7rem] font-[var(--font-bold)]">
            {s.icon}
          </span>
          {title}
        </div>
      )}
      <div className="text-[var(--text-xs)] sm:text-[var(--text-sm)] leading-[var(--leading-relaxed)] text-[var(--fg-muted)]">
        {children}
      </div>
    </div>
  );
}

function StepList({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <div className="flex flex-col gap-[var(--space-3)] sm:gap-[var(--space-4)]">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-[var(--space-3)] sm:gap-[var(--space-4)]">
          <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] font-[var(--font-family-mono)] text-[var(--text-xs)] sm:text-[var(--text-sm)] font-[var(--font-bold)] text-[var(--accent-default)]">
            {i + 1}
          </div>
          <div className="flex min-w-0 flex-col gap-[var(--space-1)] pt-[var(--space-0-5)] sm:pt-[var(--space-1)]">
            <span className="text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--fg-default)]">
              {step.title}
            </span>
            <span className="text-[var(--text-xs)] sm:text-[var(--text-sm)] leading-[var(--leading-relaxed)] text-[var(--fg-muted)]">
              {step.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
 * PAGE
 * ────────────────────────────────────────────────────────────────────────── */

export default function DocsPage() {
  return (
    <div className="flex min-h-[calc(100dvh-48px)]">
      {/* Sidebar */}
      <DocsSidebar sections={[...SECTIONS]} />

      {/* Content — full-width on mobile, offset by sidebar on desktop */}
      <div className="w-full min-w-0 lg:pl-72">
        <div className="mx-auto max-w-3xl px-[var(--space-4)] py-[var(--space-6)] sm:px-[var(--space-8)] sm:py-[var(--space-12)] lg:py-[var(--space-16)]">
          <article className="flex flex-col gap-[var(--space-4)] sm:gap-[var(--space-6)]">

            {/* ── INTRODUCTION ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-[var(--space-3)] sm:gap-[var(--space-4)]" id="introduction">
              <Badge variant="primary">Documentation</Badge>
              <h1 className="text-[var(--text-2xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] leading-[var(--leading-none)] tracking-[var(--tracking-tighter)] bg-gradient-to-b from-[var(--fg-default)] via-[var(--fg-default)] to-[var(--fg-muted)] bg-clip-text text-transparent">
                pip Platform Docs
              </h1>
              <Paragraph>
                Comprehensive documentation for the pip platform — a permissionless token
                launcher built on Base using the Clanker v4 protocol. Learn how token creation,
                fee sharing, vesting, and the deflationary $PIPAI mechanics work under the hood.
              </Paragraph>
            </div>

            <Separator />

            {/* What is pip? */}
            <SubHeading id="what-is-pip">What is pip?</SubHeading>
            <Paragraph>
              pip is a platform that lets anyone create an ERC-20 token for any X (Twitter) profile
              in seconds. The token is deployed on Base L2 through the Clanker v4 protocol, which
              handles liquidity pool creation, fee distribution, and token vesting automatically.
            </Paragraph>
            <Paragraph>
              The key innovation is that the person the token is created <em>for</em> doesn&apos;t need to
              sign up or take any action beforehand. Anyone can create a token for any X handle, and
              the profile owner can later claim their vested tokens and trading fees by verifying
              ownership of the X account.
            </Paragraph>

            <Callout type="info" title="No-code required">
              You don&apos;t need any smart contract knowledge or coding experience. Just connect your wallet,
              pick a profile, configure the token details, and deploy.
            </Callout>

            {/* Key Concepts */}
            <SubHeading id="key-concepts">Key Concepts</SubHeading>
            <div className="grid gap-[var(--space-2)] sm:gap-[var(--space-4)] sm:grid-cols-2">
              {[
                {
                  term: "Token Launcher",
                  definition: "The user who creates a token for an X profile. They initiate the deployment transaction.",
                },
                {
                  term: "Profile Owner",
                  definition: "The X account the token is created for. They receive 10% vested supply and claim 80% of trading fees.",
                },
                {
                  term: "Clanker v4",
                  definition: "The underlying protocol that handles token deployment, Uniswap V3 pool creation, and fee locking.",
                },
                {
                  term: "$PIPAI",
                  definition: "The platform's native token. All platform fees are used to buy and permanently burn $PIPAI.",
                },
              ].map((item) => (
                <Card key={item.term} variant="default" padding="md">
                  <CardContent>
                    <VStack gap="xs">
                      <Text variant="label" className="text-[var(--fg-default)]">
                        {item.term}
                      </Text>
                      <Text variant="body-sm">{item.definition}</Text>
                    </VStack>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-[var(--space-4)]" />

            {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
            <SectionHeading id="how-it-works">How It Works</SectionHeading>
            <Paragraph>
              This section covers the complete lifecycle of a token — from creation through deployment
              to fee generation and distribution.
            </Paragraph>

            {/* Token Creation Flow */}
            <SubHeading id="token-creation-flow">Token Creation Flow</SubHeading>
            <Paragraph>
              When a user creates a token through pip, the following sequence happens:
            </Paragraph>

            <StepList
              steps={[
                {
                  title: "Authenticate with X",
                  description:
                    "The launcher signs in using their X account via Privy authentication. This verifies their identity and links their wallet.",
                },
                {
                  title: "Select a target X profile",
                  description:
                    "Enter the X handle of the person the token should represent. The profile doesn't need an existing account on pip.",
                },
                {
                  title: "Configure token details",
                  description:
                    "Choose a token name, ticker symbol ($TICKER), and optionally upload a custom image. These become the on-chain metadata.",
                },
                {
                  title: "Deploy via Clanker v4",
                  description:
                    "pip calls the Clanker v4 factory contract to deploy the ERC-20 token, create a Uniswap V3 liquidity pool, and configure fee locking — all in a single transaction.",
                },
                {
                  title: "Token goes live",
                  description:
                    "The token is immediately tradeable on Uniswap. Trading fees start accumulating. 10% of supply begins vesting for the profile owner.",
                },
              ]}
            />

            {/* Smart Contract Deployment */}
            <SubHeading id="smart-contract-deployment">Smart Contract Deployment</SubHeading>
            <Paragraph>
              Under the hood, pip interacts with the Clanker v4 Factory contract to deploy tokens.
              Each deployment creates:
            </Paragraph>

            <ul className="flex flex-col gap-[var(--space-2)] pl-[var(--space-4)] sm:pl-[var(--space-6)] text-[var(--text-xs)] sm:text-[var(--text-sm)] leading-[var(--leading-relaxed)] text-[var(--fg-muted)] list-disc marker:text-[var(--fg-subtle)]">
              <li>A new ERC-20 token contract with the specified name and symbol</li>
              <li>A Uniswap V3 concentrated liquidity pool (token/WETH pair)</li>
              <li>A fee locker position through the Clanker Fee Locker contract</li>
              <li>A vesting allocation in the Clanker Vault for the profile owner</li>
            </ul>

            <CodeBlock title="Clanker v4 Factory">
{`// Simplified deployment flow
ClankerFactory.deployToken({
  name: "Token Name",
  symbol: "TICKER",
  image: "ipfs://...",
  // Automatic configuration:
  // → 10% supply vested for profile owner
  // → Fee locker splits: 80% profile / 20% platform
  // → Uniswap V3 pool with full-range liquidity
})`}
            </CodeBlock>

            {/* Liquidity Pool */}
            <SubHeading id="liquidity-pool">Liquidity Pool</SubHeading>
            <Paragraph>
              Every token launched through pip gets a Uniswap V3 liquidity pool paired with WETH
              (Wrapped Ether on Base). The pool is configured with full-range liquidity, meaning
              the token is tradeable across all price ranges from the moment of deployment.
            </Paragraph>
            <Paragraph>
              The liquidity position is locked in the Clanker Fee Locker contract — it cannot be
              removed or rug-pulled. This is a core safety guarantee of the Clanker v4 protocol.
              Trading fees from the pool are the primary revenue mechanism for both the profile
              owner and the platform.
            </Paragraph>

            <Callout type="tip" title="Locked liquidity">
              All liquidity is permanently locked in the fee locker contract. Neither the launcher
              nor the profile owner can remove liquidity — only collect trading fees.
            </Callout>

            <Separator className="my-[var(--space-4)]" />

            {/* ── FEE STRUCTURE ─────────────────────────────────────────── */}
            <SectionHeading id="fee-structure">Fee Structure</SectionHeading>
            <Paragraph>
              pip uses a transparent fee model where the vast majority of trading fees go directly
              to the profile owner the token was created for.
            </Paragraph>

            {/* 80/20 Fee Split */}
            <SubHeading id="fee-split">80/20 Fee Split</SubHeading>
            <Paragraph>
              Every trade on the Uniswap V3 pool generates a fee (the standard Uniswap trading fee).
              This fee is split between two parties:
            </Paragraph>

            <div className="grid gap-[var(--space-3)] sm:gap-[var(--space-4)] sm:grid-cols-2">
              <Card variant="default" padding="md" className="border-[var(--status-success-border)] sm:p-[var(--space-6)]">
                <CardContent>
                  <VStack gap="sm">
                    <HStack align="center" gap="sm" wrap>
                      <span className="text-[var(--text-2xl)] sm:text-[var(--text-3xl)] font-[var(--font-bold)] text-[var(--status-success)]">
                        80%
                      </span>
                      <Badge variant="success">Profile Owner</Badge>
                    </HStack>
                    <Text variant="body-sm">
                      The majority of all trading fees goes to the X profile the token
                      was created for. This is claimable once the profile owner verifies
                      their identity.
                    </Text>
                  </VStack>
                </CardContent>
              </Card>
              <Card variant="default" padding="md" className="border-[var(--color-primary-800)] sm:p-[var(--space-6)]">
                <CardContent>
                  <VStack gap="sm">
                    <HStack align="center" gap="sm" wrap>
                      <span className="text-[var(--text-2xl)] sm:text-[var(--text-3xl)] font-[var(--font-bold)] text-[var(--accent-default)]">
                        20%
                      </span>
                      <Badge variant="primary">Platform</Badge>
                    </HStack>
                    <Text variant="body-sm">
                      The platform&apos;s share of trading fees. 100% of this amount is used
                      to buy and burn $PIPAI, making the platform token deflationary.
                    </Text>
                  </VStack>
                </CardContent>
              </Card>
            </div>

            {/* Fee Collection */}
            <SubHeading id="fee-collection">Fee Collection</SubHeading>
            <Paragraph>
              Fees accumulate in the Clanker Fee Locker contract as the token is traded. The fee locker
              holds the Uniswap V3 liquidity position and collects swap fees automatically. Neither party
              needs to do anything for fees to accumulate — they accrue with every trade.
            </Paragraph>
            <Paragraph>
              The fee locker contract keeps a running tally of unclaimed fees for both the profile owner
              (80%) and the platform (20%). Fees are denominated in the pool&apos;s underlying assets — typically
              a mix of the token itself and WETH.
            </Paragraph>

            {/* Claiming Fees */}
            <SubHeading id="claiming-fees">Claiming Fees</SubHeading>
            <Paragraph>
              Profile owners can claim their accumulated trading fees at any time through the pip dashboard.
              The process requires authentication to verify X account ownership:
            </Paragraph>

            <StepList
              steps={[
                {
                  title: "Sign in with X",
                  description: "Authenticate on pip using the X account the token was created for.",
                },
                {
                  title: "Navigate to Dashboard",
                  description: "View all tokens created for your profile and their accumulated fees.",
                },
                {
                  title: "Claim fees",
                  description:
                    "Click the claim button to collect your 80% share. Fees are sent directly to your connected wallet.",
                },
              ]}
            />

            <Callout type="info" title="When to claim">
              There&apos;s no deadline for claiming fees. They accumulate indefinitely in the fee locker
              and can be claimed at any time. However, claiming more frequently means your wallet
              balance updates sooner.
            </Callout>

            <Separator className="my-[var(--space-4)]" />

            {/* ── TOKEN VESTING ─────────────────────────────────────────── */}
            <SectionHeading id="token-vesting">Token Vesting</SectionHeading>
            <Paragraph>
              A core feature of pip is automatic token vesting. When a token is created, 10% of
              the total supply is reserved and vested for the X profile owner.
            </Paragraph>

            {/* Vesting Mechanism */}
            <SubHeading id="vesting-mechanism">Vesting Mechanism</SubHeading>
            <Paragraph>
              The vesting is handled by the Clanker Vault contract. When a token is deployed, the
              factory contract automatically allocates 10% of the token supply to a vesting position
              in the vault, designated for the profile owner.
            </Paragraph>
            <Paragraph>
              This creates a strong alignment between the profile owner and the token community —
              the profile owner benefits from long-term token appreciation rather than being able
              to dump immediately.
            </Paragraph>

            {/* Vesting parameters — stacked cards on mobile, table on sm+ */}
            <div className="hidden sm:block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)]">
              <table className="w-full text-[var(--text-sm)]">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)]">
                    <th className="px-[var(--space-4)] py-[var(--space-3)] text-left font-[var(--font-semibold)] text-[var(--fg-default)]">
                      Parameter
                    </th>
                    <th className="px-[var(--space-4)] py-[var(--space-3)] text-left font-[var(--font-semibold)] text-[var(--fg-default)]">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--fg-muted)]">
                  <tr className="border-b border-[var(--border-default)]">
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">Vested Amount</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">10% of total token supply</td>
                  </tr>
                  <tr className="border-b border-[var(--border-default)]">
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">Recipient</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">X profile owner (claimable after verification)</td>
                  </tr>
                  <tr className="border-b border-[var(--border-default)]">
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">Vesting Contract</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">
                      <InlineCode>ClankerVault</InlineCode>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">Release</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">Linear vesting over the vesting period</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Mobile: stacked key-value layout */}
            <div className="flex flex-col gap-[var(--space-2)] sm:hidden">
              {[
                { label: "Vested Amount", value: "10% of total token supply" },
                { label: "Recipient", value: "X profile owner (claimable after verification)" },
                { label: "Vesting Contract", value: "ClankerVault" },
                { label: "Release", value: "Linear vesting over the vesting period" },
              ].map((row) => (
                <div key={row.label} className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-[var(--space-3)]">
                  <Text variant="caption" color="subtle" className="mb-[var(--space-1)]">{row.label}</Text>
                  <Text variant="body-sm" className="text-[var(--fg-default)]">{row.value}</Text>
                </div>
              ))}
            </div>

            {/* Vesting Schedule */}
            <SubHeading id="vesting-schedule">Vesting Schedule</SubHeading>
            <Paragraph>
              Tokens vest linearly over time. After an initial lockup period, the vested tokens
              begin unlocking gradually. The profile owner can claim any unlocked tokens at any point
              during or after the vesting period.
            </Paragraph>

            <CodeBlock title="Vesting timeline">
{`Token Launch
  │
  ├─── Lockup Period ───┤─── Linear Vesting ───────────┤
  │    (tokens locked)   │   (tokens unlock gradually)   │
  │                      │                               │
  t=0               lockupEnd                      vestingEnd
                         │                               │
                    First claim                    Fully vested
                    available                      (all 10%)`}
            </CodeBlock>

            <Paragraph>
              The <InlineCode>amountAvailableToClaim</InlineCode> function on the Clanker Vault contract
              returns the current amount of tokens that can be claimed at any given time, calculated
              based on the linear vesting formula.
            </Paragraph>

            {/* Claiming Vested Tokens */}
            <SubHeading id="claiming-vested-tokens">Claiming Vested Tokens</SubHeading>
            <Paragraph>
              To claim vested tokens, the profile owner must first verify their X account on pip.
              Once verified, pip transfers the admin role of the vesting allocation to the profile
              owner&apos;s wallet, enabling them to claim directly from the Clanker Vault.
            </Paragraph>

            <StepList
              steps={[
                {
                  title: "Verify X ownership",
                  description: "Sign in with the X account the token was created for.",
                },
                {
                  title: "Admin transfer",
                  description:
                    "pip calls editAllocationAdmin on the ClankerVault to transfer claim rights to your wallet.",
                },
                {
                  title: "Claim tokens",
                  description:
                    "Call the claim function (via the dashboard) to receive your currently vested tokens.",
                },
              ]}
            />

            <Separator className="my-[var(--space-4)]" />

            {/* ── $PIPAI TOKEN ──────────────────────────────────────────── */}
            <SectionHeading id="pipai-token">$PIPAI Token</SectionHeading>
            <Paragraph>
              $PIPAI is the native platform token of pip. It has a unique deflationary mechanism
              that ties its value directly to platform activity.
            </Paragraph>

            {/* Buy & Burn Mechanics */}
            <SubHeading id="buy-and-burn">Buy &amp; Burn Mechanics</SubHeading>
            <Paragraph>
              The buy and burn mechanism is the core economic engine of $PIPAI. Here&apos;s how it works:
            </Paragraph>

            <div className="flex flex-col gap-[var(--space-2)] sm:gap-[var(--space-3)]">
              <Card variant="default" padding="md">
                <CardContent>
                  <div className="flex gap-[var(--space-3)] sm:gap-[var(--space-4)]">
                    <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] font-[var(--font-family-mono)] text-[var(--text-xs)] sm:text-[var(--text-sm)] font-[var(--font-bold)] text-[var(--accent-default)]">
                      1
                    </div>
                    <VStack gap="xs" className="min-w-0">
                      <Text variant="label" className="text-[var(--fg-default)]">
                        Fees are collected
                      </Text>
                      <Text variant="body-sm">
                        The platform earns 20% of trading fees from every token launched through pip.
                        These accumulate in the platform&apos;s admin wallet across all deployed tokens.
                      </Text>
                    </VStack>
                  </div>
                </CardContent>
              </Card>
              <Card variant="default" padding="md">
                <CardContent>
                  <div className="flex gap-[var(--space-3)] sm:gap-[var(--space-4)]">
                    <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] font-[var(--font-family-mono)] text-[var(--text-xs)] sm:text-[var(--text-sm)] font-[var(--font-bold)] text-[var(--accent-default)]">
                      2
                    </div>
                    <VStack gap="xs" className="min-w-0">
                      <Text variant="label" className="text-[var(--fg-default)]">
                        $PIPAI is purchased
                      </Text>
                      <Text variant="body-sm">
                        Collected platform fees are used to buy $PIPAI on the open market via
                        its Uniswap pool. This creates consistent buy pressure.
                      </Text>
                    </VStack>
                  </div>
                </CardContent>
              </Card>
              <Card variant="default" padding="md">
                <CardContent>
                  <div className="flex gap-[var(--space-3)] sm:gap-[var(--space-4)]">
                    <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] font-[var(--font-family-mono)] text-[var(--text-xs)] sm:text-[var(--text-sm)] font-[var(--font-bold)] text-[var(--accent-default)]">
                      3
                    </div>
                    <VStack gap="xs" className="min-w-0">
                      <Text variant="label" className="text-[var(--fg-default)]">
                        Tokens are burned
                      </Text>
                      <Text variant="body-sm">
                        Purchased $PIPAI tokens are sent to the zero address, permanently removing
                        them from circulation. This is verifiable on-chain.
                      </Text>
                    </VStack>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deflationary Model */}
            <SubHeading id="deflationary-model">Deflationary Model</SubHeading>
            <Paragraph>
              The buy &amp; burn creates a flywheel effect: more tokens launched on pip means more
              trading volume, which means more fees collected, which means more $PIPAI bought and
              burned, which reduces supply.
            </Paragraph>

            <CodeBlock title="Deflationary flywheel">
{`More tokens launched on pip
       ↓
More trading volume across all tokens
       ↓
More fees collected (20% platform share)
       ↓
More $PIPAI bought on open market
       ↓
More $PIPAI permanently burned
       ↓
Decreasing $PIPAI supply
       ↓
Each remaining $PIPAI represents
a larger share of the ecosystem`}
            </CodeBlock>

            <Callout type="warning" title="Not financial advice">
              The deflationary mechanism reduces supply over time, but token price depends on
              many factors including demand, market conditions, and overall platform adoption.
              This documentation describes the technical mechanics, not investment outcomes.
            </Callout>

            {/* Token Details */}
            <SubHeading id="token-details">Token Details</SubHeading>
            <Card variant="elevated" padding="md" className="border-[var(--border-strong)] sm:p-[var(--space-6)]">
              <CardContent>
                <VStack gap="md">
                  {/* Mobile: stacked key-value pairs */}
                  <div className="flex flex-col gap-[var(--space-2)] sm:hidden">
                    {[
                      { label: "Token Name", value: "$PIPAI" },
                      { label: "Network", value: "Base (Ethereum L2)" },
                      { label: "Contract", value: CONTRACTS.pipaiToken },
                      { label: "Mechanism", value: "Deflationary (buy & burn)" },
                    ].map((row) => (
                      <div key={row.label} className="flex flex-col gap-[var(--space-0-5)] border-b border-[var(--border-default)] pb-[var(--space-2)] last:border-b-0 last:pb-0">
                        <span className="text-[var(--text-xs)] text-[var(--fg-subtle)]">{row.label}</span>
                        <span className="text-[var(--text-sm)] text-[var(--fg-default)] break-all font-[var(--font-family-mono)]">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Desktop: table layout */}
                  <div className="hidden sm:block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)]">
                    <table className="w-full text-[var(--text-sm)]">
                      <tbody className="text-[var(--fg-muted)]">
                        <tr className="border-b border-[var(--border-default)]">
                          <td className="px-[var(--space-4)] py-[var(--space-3)] font-[var(--font-medium)] text-[var(--fg-default)]">
                            Token Name
                          </td>
                          <td className="px-[var(--space-4)] py-[var(--space-3)]">$PIPAI</td>
                        </tr>
                        <tr className="border-b border-[var(--border-default)]">
                          <td className="px-[var(--space-4)] py-[var(--space-3)] font-[var(--font-medium)] text-[var(--fg-default)]">
                            Network
                          </td>
                          <td className="px-[var(--space-4)] py-[var(--space-3)]">Base (Ethereum L2)</td>
                        </tr>
                        <tr className="border-b border-[var(--border-default)]">
                          <td className="px-[var(--space-4)] py-[var(--space-3)] font-[var(--font-medium)] text-[var(--fg-default)]">
                            Contract Address
                          </td>
                          <td className="px-[var(--space-4)] py-[var(--space-3)]">
                            <code className="break-all font-[var(--font-family-mono)] text-[var(--text-xs)]">
                              {CONTRACTS.pipaiToken}
                            </code>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-[var(--space-4)] py-[var(--space-3)] font-[var(--font-medium)] text-[var(--fg-default)]">
                            Mechanism
                          </td>
                          <td className="px-[var(--space-4)] py-[var(--space-3)]">Deflationary (buy &amp; burn)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <HStack gap="sm" wrap>
                    <a href={PIPAI_TOKEN_URL} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="sm">
                        View on Basescan <IconExternalLink />
                      </Button>
                    </a>
                    <a href={PIPAI_DEXSCREENER_URL} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="sm">
                        DEX Screener <IconExternalLink />
                      </Button>
                    </a>
                  </HStack>
                </VStack>
              </CardContent>
            </Card>

            <Separator className="my-[var(--space-4)]" />

            {/* ── TECHNICAL ARCHITECTURE ─────────────────────────────────── */}
            <SectionHeading id="technical-architecture">Technical Architecture</SectionHeading>
            <Paragraph>
              pip is built on a stack of battle-tested protocols and infrastructure. This section
              covers the key technical components.
            </Paragraph>

            {/* Clanker v4 */}
            <SubHeading id="clanker-v4">Clanker v4 Protocol</SubHeading>
            <Paragraph>
              Clanker v4 is the latest version of the Clanker token deployment protocol. It provides
              a factory pattern for creating ERC-20 tokens with built-in Uniswap V3 liquidity and
              fee distribution. Key improvements in v4 include:
            </Paragraph>

            <ul className="flex flex-col gap-[var(--space-2)] pl-[var(--space-4)] sm:pl-[var(--space-6)] text-[var(--text-xs)] sm:text-[var(--text-sm)] leading-[var(--leading-relaxed)] text-[var(--fg-muted)] list-disc marker:text-[var(--fg-subtle)]">
              <li>
                <strong className="text-[var(--fg-default)]">Gas efficiency</strong> — Optimized
                contract bytecode reduces deployment costs on Base L2
              </li>
              <li>
                <strong className="text-[var(--fg-default)]">Built-in vesting</strong> — Native
                support for token vesting through the ClankerVault contract
              </li>
              <li>
                <strong className="text-[var(--fg-default)]">Fee locker</strong> — Permanent
                liquidity locking with configurable fee distribution between parties
              </li>
              <li>
                <strong className="text-[var(--fg-default)]">Admin controls</strong> — Transferable
                allocation admin roles for flexible claim management
              </li>
            </ul>

            {/* Base L2 */}
            <SubHeading id="base-l2">Base L2 Network</SubHeading>
            <Paragraph>
              All pip tokens are deployed on Base, an Ethereum Layer 2 built on the OP Stack.
              Base provides the security guarantees of Ethereum mainnet with significantly lower
              transaction costs and faster confirmation times.
            </Paragraph>

            <div className="grid grid-cols-3 gap-[var(--space-2)] sm:gap-[var(--space-4)]">
              {[
                { label: "Settlement", value: "Ethereum L1" },
                { label: "Block time", value: "~2 seconds" },
                { label: "Gas costs", value: "Fraction of L1" },
              ].map((item) => (
                <Card key={item.label} variant="default" padding="sm" className="sm:p-[var(--space-4)]">
                  <CardContent>
                    <VStack gap="xs" align="center" className="text-center">
                      <Text variant="caption" color="subtle">{item.label}</Text>
                      <Text variant="body-sm" className="font-[var(--font-semibold)] sm:text-[var(--text-base)]">{item.value}</Text>
                    </VStack>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contract Addresses */}
            <SubHeading id="contract-addresses">Contract Addresses</SubHeading>
            <Paragraph>
              All contracts are verified on Basescan. You can interact with them directly or
              through the pip interface.
            </Paragraph>

            {/* Contract addresses — stacked cards on mobile, table on sm+ */}
            <div className="flex flex-col gap-[var(--space-2)] sm:hidden">
              {[
                { name: "Clanker Factory v4", address: CONTRACTS.clankerFactoryV4 },
                { name: "Fee Locker v4", address: CONTRACTS.clankerFeeLockerV4 },
                { name: "Clanker Vault", address: CONTRACTS.clankerVault },
                { name: "WETH", address: CONTRACTS.weth },
                { name: "$PIPAI Token", address: CONTRACTS.pipaiToken },
              ].map((c) => (
                <div key={c.name} className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-[var(--space-3)]">
                  <Text variant="caption" color="subtle" className="mb-[var(--space-1)]">{c.name}</Text>
                  <code className="block break-all font-[var(--font-family-mono)] text-[var(--text-xs)] text-[var(--fg-default)] leading-[var(--leading-relaxed)]">
                    {c.address}
                  </code>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)]">
              <table className="w-full text-[var(--text-sm)]">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)]">
                    <th className="px-[var(--space-4)] py-[var(--space-3)] text-left font-[var(--font-semibold)] text-[var(--fg-default)]">
                      Contract
                    </th>
                    <th className="px-[var(--space-4)] py-[var(--space-3)] text-left font-[var(--font-semibold)] text-[var(--fg-default)]">
                      Address
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--fg-muted)]">
                  <tr className="border-b border-[var(--border-default)]">
                    <td className="px-[var(--space-4)] py-[var(--space-3)] whitespace-nowrap">Clanker Factory v4</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">
                      <code className="break-all font-[var(--font-family-mono)] text-[var(--text-xs)]">
                        {CONTRACTS.clankerFactoryV4}
                      </code>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-default)]">
                    <td className="px-[var(--space-4)] py-[var(--space-3)] whitespace-nowrap">Fee Locker v4</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">
                      <code className="break-all font-[var(--font-family-mono)] text-[var(--text-xs)]">
                        {CONTRACTS.clankerFeeLockerV4}
                      </code>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-default)]">
                    <td className="px-[var(--space-4)] py-[var(--space-3)] whitespace-nowrap">Clanker Vault</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">
                      <code className="break-all font-[var(--font-family-mono)] text-[var(--text-xs)]">
                        {CONTRACTS.clankerVault}
                      </code>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-default)]">
                    <td className="px-[var(--space-4)] py-[var(--space-3)] whitespace-nowrap">WETH</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">
                      <code className="break-all font-[var(--font-family-mono)] text-[var(--text-xs)]">
                        {CONTRACTS.weth}
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-[var(--space-4)] py-[var(--space-3)] whitespace-nowrap">$PIPAI Token</td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">
                      <code className="break-all font-[var(--font-family-mono)] text-[var(--text-xs)]">
                        {CONTRACTS.pipaiToken}
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Separator className="my-[var(--space-4)]" />

            {/* ── FOR CREATORS ──────────────────────────────────────────── */}
            <SectionHeading id="for-creators">For Creators</SectionHeading>
            <Paragraph>
              If someone has created a token for your X profile, here&apos;s everything you need to know
              about claiming your tokens and fees.
            </Paragraph>

            {/* Getting Started */}
            <SubHeading id="getting-started">Getting Started</SubHeading>
            <Paragraph>
              As a creator (the person a token was created for), you have two main benefits:
            </Paragraph>

            <div className="grid gap-[var(--space-2)] sm:gap-[var(--space-4)] sm:grid-cols-2">
              <Card variant="default" padding="md" className="sm:p-[var(--space-6)]">
                <CardContent>
                  <VStack gap="sm">
                    <Badge variant="success">Vested Tokens</Badge>
                    <Text variant="h4">10% of supply</Text>
                    <Text variant="body-sm">
                      10% of the total token supply is reserved for you and vests linearly
                      over time. These tokens are yours to claim as they unlock.
                    </Text>
                  </VStack>
                </CardContent>
              </Card>
              <Card variant="default" padding="md" className="sm:p-[var(--space-6)]">
                <CardContent>
                  <VStack gap="sm">
                    <Badge variant="primary">Trading Fees</Badge>
                    <Text variant="h4">80% of fees</Text>
                    <Text variant="body-sm">
                      You receive 80% of all Uniswap trading fees generated by your token.
                      These accumulate automatically and can be claimed anytime.
                    </Text>
                  </VStack>
                </CardContent>
              </Card>
            </div>

            {/* Claiming Your Token */}
            <SubHeading id="claiming-your-token">Claiming Your Token</SubHeading>
            <Paragraph>
              To claim ownership and start receiving benefits, follow these steps:
            </Paragraph>

            <StepList
              steps={[
                {
                  title: "Visit pip and sign in",
                  description:
                    "Go to the pip platform and click \"Sign in with X\". Authenticate with the same X account the token was created for.",
                },
                {
                  title: "Connect a wallet",
                  description:
                    "You'll need an Ethereum-compatible wallet (e.g., MetaMask, Coinbase Wallet) on the Base network to receive tokens and fees.",
                },
                {
                  title: "Go to your Dashboard",
                  description:
                    "The dashboard shows all tokens associated with your X profile, including vested amounts and accumulated fees.",
                },
                {
                  title: "Claim vested tokens",
                  description:
                    "Click \"Claim\" on any token to receive your currently unlocked vested tokens. They'll be sent directly to your wallet.",
                },
              ]}
            />

            {/* Managing Fees */}
            <SubHeading id="managing-fees">Managing Fees</SubHeading>
            <Paragraph>
              Trading fees accumulate continuously as your token is traded. You can monitor
              and claim your fees through the dashboard. Key things to know:
            </Paragraph>

            <ul className="flex flex-col gap-[var(--space-2)] pl-[var(--space-4)] sm:pl-[var(--space-6)] text-[var(--text-xs)] sm:text-[var(--text-sm)] leading-[var(--leading-relaxed)] text-[var(--fg-muted)] list-disc marker:text-[var(--fg-subtle)]">
              <li>Fees accumulate in real-time with every trade</li>
              <li>No minimum claim amount — claim any amount at any time</li>
              <li>Fees are paid in the pool&apos;s underlying assets (token + WETH)</li>
              <li>Claiming requires a small gas fee on Base (typically fractions of a cent)</li>
              <li>Unclaimed fees remain safely in the fee locker contract indefinitely</li>
            </ul>

            <Separator className="my-[var(--space-4)]" />

            {/* ── FAQ ───────────────────────────────────────────────────── */}
            <SectionHeading id="faq">Frequently Asked Questions</SectionHeading>

            <div className="flex flex-col gap-[var(--space-2)] sm:gap-[var(--space-4)]">
              {[
                {
                  q: "Can I create a token for any X account?",
                  a: "Yes. You can create a token for any public X profile. The profile owner doesn't need to sign up or take any action beforehand. They can claim their vested tokens and fees later by verifying their X account.",
                },
                {
                  q: "What happens if the profile owner never claims?",
                  a: "The vested tokens remain in the Clanker Vault contract and trading fees remain in the fee locker. They don't expire — the profile owner can claim at any time in the future.",
                },
                {
                  q: "Can multiple tokens be created for the same X profile?",
                  a: "Yes, multiple tokens can be created for the same X profile. Each token has its own independent vesting allocation and fee accumulation.",
                },
                {
                  q: "Can the liquidity be removed (rug pull)?",
                  a: "No. All liquidity is permanently locked in the Clanker Fee Locker contract. Neither the token launcher, the profile owner, nor the platform can remove liquidity. Only trading fees can be collected.",
                },
                {
                  q: "What chain do I need to be on?",
                  a: "Base (an Ethereum L2). You'll need a small amount of ETH on Base to pay for gas fees when claiming tokens or fees. You can bridge ETH to Base from Ethereum mainnet using the official Base Bridge.",
                },
                {
                  q: "How does the $PIPAI buy & burn work?",
                  a: "The platform collects 20% of all trading fees. These fees are periodically used to purchase $PIPAI on the open market and then send the purchased tokens to the zero address (0x000...0), permanently removing them from circulation.",
                },
                {
                  q: "Is pip open source?",
                  a: "The smart contracts (Clanker v4) are verified and readable on Basescan. All token deployments, fee distributions, and burn transactions are fully transparent and verifiable on-chain.",
                },
                {
                  q: "What wallets are supported?",
                  a: "pip uses Privy for authentication, which supports most popular wallets including MetaMask, Coinbase Wallet, Rainbow, and WalletConnect-compatible wallets.",
                },
              ].map((item, i) => (
                <Card key={i} variant="default" padding="md" className="sm:p-[var(--space-6)]">
                  <CardContent>
                    <VStack gap="xs" className="sm:gap-[var(--space-3)]">
                      <Text variant="body-sm" className="font-[var(--font-semibold)] text-[var(--fg-default)] sm:text-[var(--text-base)]">
                        {item.q}
                      </Text>
                      <Text variant="body-sm">{item.a}</Text>
                    </VStack>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ── CTA ───────────────────────────────────────────────────── */}
            <Separator className="my-[var(--space-4)]" />

            <Card variant="elevated" padding="md" className="border-[var(--border-strong)] sm:p-[var(--space-6)]">
              <CardContent>
                <VStack align="center" gap="md" className="py-[var(--space-2)] sm:py-[var(--space-4)] text-center">
                  <Text variant="h3" align="center">
                    Ready to get started?
                  </Text>
                  <Text variant="body-sm" align="center" className="max-w-md">
                    Launch a token for any X profile in under a minute, or sign in to
                    claim tokens and fees for your profile.
                  </Text>
                  <div className="flex flex-col sm:flex-row gap-[var(--space-2)] sm:gap-[var(--space-3)] w-full sm:w-auto items-center">
                    <Link href="/launch" className="w-full sm:w-auto">
                      <Button variant="primary" size="lg" className="w-full sm:w-auto">
                        Launch a Token <IconArrowRight />
                      </Button>
                    </Link>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </VStack>
              </CardContent>
            </Card>

          </article>
        </div>
      </div>
    </div>
  );
}
