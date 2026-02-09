# pip

Launch [Clanker v4](https://clanker.world) tokens on **Base** for any X (Twitter) profile. The profile owner can claim **80% of trading fees** and **vesting tokens**.

## Tech Stack

- **Framework** - [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Auth** - [Privy](https://privy.io/) (Twitter / X login)
- **Database** - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) + [Drizzle ORM](https://orm.drizzle.team/)
- **Blockchain** - [Base](https://base.org/) via [viem](https://viem.sh/) + [Clanker SDK](https://www.npmjs.com/package/clanker-sdk)
- **Styling** - [Tailwind CSS v4](https://tailwindcss.com/)
- **Deployment** - [Vercel](https://vercel.com/)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy application ID |
| `PRIVY_APP_SECRET` | Privy server secret |
| `PRIVY_VERIFICATION_KEY` | Privy JWT verification key |
| `POSTGRES_URL` | Vercel Postgres connection string |
| `ADMIN_PRIVATE_KEY` | Private key for the admin wallet on Base |
| `ADMIN_WALLET_ADDRESS` | Public address of the admin wallet |
| `CLANKER_API_KEY` | Clanker API key |
| `BASE_RPC_URL` | Base mainnet RPC URL (defaults to `https://mainnet.base.org`) |
| `CRON_SECRET` | Secret used to authenticate Vercel cron jobs |
| `NEXT_PUBLIC_BASE_URL` | Public-facing URL of the app |

### 3. Set up the database

```bash
npm run db:push    # Push schema to the database (development)
npm run db:generate # Generate migration files
npm run db:migrate  # Run migrations (production)
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/me/       # GET - authenticate & sync user, return claimable tokens
│   │   ├── claim/         # POST - claim a token (on-chain reward + vault transfer)
│   │   ├── launch/        # POST - deploy a new Clanker v4 token
│   │   └── tokens/        # GET - list all launched tokens (paginated)
│   ├── cron/
│   │   └── collect-fees/  # GET - Vercel cron, collects platform fees every 6 hours
│   ├── dashboard/         # Dashboard page - view & claim tokens
│   ├── layout.tsx         # Root layout with Privy provider
│   └── page.tsx           # Home page - launch form + recent tokens
├── components/
│   ├── claim-button.tsx   # Claim flow UI with wallet address input
│   ├── dashboard-tokens.tsx # Dashboard token grid with claim/claimed sections
│   ├── header.tsx         # Top nav with auth controls
│   ├── launch-form.tsx    # Token launch form
│   ├── providers.tsx      # Privy provider wrapper
│   ├── token-card.tsx     # Token display card
│   └── token-list.tsx     # Recent tokens list
├── lib/
│   ├── admin-wallet.ts    # viem wallet/public clients for the admin wallet
│   ├── auth.ts            # Privy server-side JWT verification
│   ├── clanker.ts         # Clanker SDK wrapper (deploy, claim, vault management)
│   ├── contracts.ts       # Contract addresses and ABIs
│   ├── db/
│   │   ├── index.ts       # Drizzle client instance
│   │   └── schema.ts      # Database schema (users, launches, fee_collections)
│   └── rate-limit.ts      # 1 launch per user per day rate limiter
├── middleware.ts           # Edge middleware (cron auth)
└── types/
    └── index.ts           # Shared TypeScript interfaces
```

## Key Flows

### Token Launch
1. User signs in with X via Privy
2. User fills in target X handle, token name/symbol/image
3. Server deploys a Clanker v4 token on Base with admin as reward recipient
4. Token appears in the public feed and the target profile's dashboard

### Token Claim
1. Target X profile owner signs in with Privy
2. Dashboard shows any unclaimed tokens matching their handle
3. User provides a wallet address and triggers the claim
4. Server updates the on-chain reward recipient (80% slot) and vault beneficiary

### Fee Collection (Cron)
- Runs every 6 hours via Vercel Cron
- Collects the 20% platform fee slice from all deployed tokens

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:migrate` | Run Drizzle migrations |
| `npm run db:push` | Push schema directly (dev) |
| `npm run db:studio` | Open Drizzle Studio |
