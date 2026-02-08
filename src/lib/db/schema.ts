import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  privyDid: text("privy_did").unique().notNull(),
  twitterUsername: varchar("twitter_username", { length: 64 }).unique(),
  twitterName: text("twitter_name"),
  twitterProfilePicture: text("twitter_profile_picture"),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const launches = pgTable("launches", {
  id: uuid("id").defaultRandom().primaryKey(),
  launcherUserId: uuid("launcher_user_id")
    .references(() => users.id)
    .notNull(),
  targetTwitterUsername: varchar("target_twitter_username", {
    length: 64,
  }).notNull(),
  targetTwitterName: text("target_twitter_name"),
  targetTwitterProfilePicture: text("target_twitter_profile_picture"),
  tokenAddress: text("token_address").unique(),
  tokenName: varchar("token_name", { length: 128 }).notNull(),
  tokenSymbol: varchar("token_symbol", { length: 16 }).notNull(),
  tokenImageUrl: text("token_image_url"),
  deployTxHash: text("deploy_tx_hash"),
  poolAddress: text("pool_address"),
  clankerRequestKey: varchar("clanker_request_key", { length: 32 })
    .unique()
    .notNull(),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  claimed: boolean("claimed").notNull().default(false),
  claimedByUserId: uuid("claimed_by_user_id").references(() => users.id),
  claimedAt: timestamp("claimed_at"),
  claimerWalletAddress: text("claimer_wallet_address"),
  claimTxHash: text("claim_tx_hash"),
  vaultClaimTxHash: text("vault_claim_tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feeCollections = pgTable("fee_collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  launchId: uuid("launch_id")
    .references(() => launches.id)
    .notNull(),
  tokenAddress: text("token_address").notNull(),
  amountWei: text("amount_wei").notNull(),
  txHash: text("tx_hash").notNull(),
  collectedAt: timestamp("collected_at").defaultNow().notNull(),
});
