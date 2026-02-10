import { parseEther } from "viem";
import {
  DopplerSDK,
  WAD,
  getAddresses,
} from "@whetstone-research/doppler-sdk";
import type { Address } from "viem";
import {
  getAdminWalletClient,
  getPublicClient,
  getAdminAddress,
} from "./admin-wallet";

// ── SDK Helpers ──────────────────────────────────────────────────────────────

function getDopplerSDK() {
  const publicClient = getPublicClient();
  const walletClient = getAdminWalletClient();
  return new DopplerSDK({
    publicClient,
    walletClient,
    chainId: 8453, // Base mainnet
  });
}

function getBaseAddresses() {
  return getAddresses(8453);
}

/**
 * Read the Airlock owner (Doppler protocol beneficiary) from on-chain.
 * The Airlock owner must always receive >= 5% of beneficiary shares.
 */
async function getAirlockOwner(): Promise<Address> {
  const publicClient = getPublicClient();
  const addresses = getBaseAddresses();

  const airlockOwnerAbi = [
    {
      name: "owner",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "address" }],
    },
  ] as const;

  const owner = (await publicClient.readContract({
    address: addresses.airlock,
    abi: airlockOwnerAbi,
    functionName: "owner",
  })) as Address;

  return owner;
}

// ── Configuration ────────────────────────────────────────────────────────────

/** Total token supply: 1 billion */
const INITIAL_SUPPLY = parseEther("1000000000");

/** Tokens for sale on the bonding curve: 900 million (90%) */
const NUM_TOKENS_TO_SELL = parseEther("900000000");

/** Vested amount: 100 million tokens (10% of supply) */
const VESTED_AMOUNT = parseEther("100000000");

/** Lockup (cliff) before any tokens unlock: 30 days */
const VESTING_CLIFF_SECONDS = 2_592_000;

/** Linear vesting duration after cliff: 30 days */
const VESTING_DURATION_SECONDS = 2_592_000;

/** Swap fee: 0.3% */
const CUSTOM_SWAP_FEE = 3000;

/**
 * RehypeDopplerHook fee distribution (must sum to WAD = 1e18 = 100%):
 *  - 10% → LP providers
 *  - 90% → beneficiaries (further split by beneficiary shares)
 *  -  0% → asset buyback
 *  -  0% → numeraire buyback
 */
const LP_PERCENT_WAD = (WAD * 10n) / 100n; // 10%
const BENEFICIARY_PERCENT_WAD = (WAD * 90n) / 100n; // 90%
const ASSET_BUYBACK_PERCENT_WAD = 0n;
const NUMERAIRE_BUYBACK_PERCENT_WAD = 0n;

/**
 * Beneficiary shares (how the 90% beneficiary pool is distributed):
 *  - 5%  → Doppler protocol (airlock owner) — minimum required
 *  - 5%  → Pip (admin wallet)
 *  - 90% → Creator (admin wallet initially, distributed off-chain after claim)
 *
 * Since Pip and Creator share initially go to the same admin wallet,
 * we combine them: airlock owner = 5%, admin wallet = 95%.
 */
const PROTOCOL_SHARE_WAD = (WAD * 5n) / 100n; // 5%
const ADMIN_SHARE_WAD = (WAD * 95n) / 100n; // 95% (5% pip + 90% creator)

// ── Deploy ───────────────────────────────────────────────────────────────────

export interface DeployTokenParams {
  name: string;
  symbol: string;
  imageUrl: string;
}

export interface DeployTokenResult {
  tokenAddress: string;
  poolId: string;
  txHash: string;
}

export async function deployToken(
  params: DeployTokenParams
): Promise<DeployTokenResult> {
  const sdk = getDopplerSDK();
  const addresses = getBaseAddresses();
  const adminAddress = getAdminAddress();
  const airlockOwner = await getAirlockOwner();

  // Resolve rehype hook addresses — prefer env overrides, fall back to SDK
  const rehypeHookAddress = (process.env.DOPPLER_REHYPE_HOOK_ADDRESS ??
    addresses.rehypeDopplerHook) as Address | undefined;
  const hookInitializerAddress = (process.env
    .DOPPLER_HOOK_INITIALIZER_ADDRESS ??
    addresses.dopplerHookInitializer) as Address | undefined;
  const noOpMigratorAddress = addresses.noOpMigrator as Address | undefined;

  if (!rehypeHookAddress)
    throw new Error(
      "RehypeDopplerHook address not configured. Set DOPPLER_REHYPE_HOOK_ADDRESS env var."
    );
  if (!hookInitializerAddress)
    throw new Error(
      "DopplerHookInitializer address not configured. Set DOPPLER_HOOK_INITIALIZER_ADDRESS env var."
    );
  if (!noOpMigratorAddress)
    throw new Error("NoOpMigrator address not available for Base.");

  // Beneficiaries for fee streaming
  const beneficiaries = [
    { beneficiary: airlockOwner, shares: PROTOCOL_SHARE_WAD }, // 5% protocol
    { beneficiary: adminAddress, shares: ADMIN_SHARE_WAD }, // 95% admin (5% pip + 90% creator)
  ];

  // Build the multicurve auction with RehypeDopplerHook
  const createParams = sdk
    .buildMulticurveAuction()
    .tokenConfig({
      type: "standard",
      name: params.name,
      symbol: params.symbol,
      tokenURI: params.imageUrl,
    })
    .saleConfig({
      initialSupply: INITIAL_SUPPLY,
      numTokensToSell: NUM_TOKENS_TO_SELL,
      numeraire: addresses.weth,
    })
    .withMarketCapPresets({
      beneficiaries,
    })
    .withRehypeDopplerHook({
      hookAddress: rehypeHookAddress,
      buybackDestination: adminAddress,
      customFee: CUSTOM_SWAP_FEE,
      assetBuybackPercentWad: ASSET_BUYBACK_PERCENT_WAD,
      numeraireBuybackPercentWad: NUMERAIRE_BUYBACK_PERCENT_WAD,
      beneficiaryPercentWad: BENEFICIARY_PERCENT_WAD,
      lpPercentWad: LP_PERCENT_WAD,
    })
    .withVesting({
      duration: BigInt(VESTING_CLIFF_SECONDS + VESTING_DURATION_SECONDS),
      cliffDuration: VESTING_CLIFF_SECONDS,
      recipients: [adminAddress],
      amounts: [VESTED_AMOUNT],
    })
    .withGovernance({ type: "noOp" })
    .withMigration({ type: "noOp" })
    .withUserAddress(adminAddress)
    .withDopplerHookInitializer(hookInitializerAddress)
    .withNoOpMigrator(noOpMigratorAddress)
    .build();

  // Deploy on-chain
  const result = await sdk.factory.createMulticurve(createParams);

  return {
    tokenAddress: result.tokenAddress,
    poolId: result.poolId,
    txHash: result.transactionHash,
  };
}

// ── Fee Collection ───────────────────────────────────────────────────────────

export interface CollectFeesResult {
  fees0: bigint;
  fees1: bigint;
  txHash: string;
}

/**
 * Collect accumulated trading fees from a multicurve pool and distribute
 * them to configured beneficiaries.
 */
export async function collectPoolFees(
  tokenAddress: `0x${string}`
): Promise<CollectFeesResult> {
  const sdk = getDopplerSDK();
  const pool = await sdk.getMulticurvePool(tokenAddress);
  const { fees0, fees1, transactionHash } = await pool.collectFees();

  return { fees0, fees1, txHash: transactionHash };
}

// ── Vesting ──────────────────────────────────────────────────────────────────

/**
 * Release any currently available vested tokens for the admin wallet.
 * Returns the transaction hash.
 */
export async function releaseVestedTokens(
  tokenAddress: `0x${string}`
): Promise<{ txHash: string }> {
  const sdk = getDopplerSDK();
  const derc20 = sdk.getDerc20(tokenAddress);
  const txHash = await derc20.release();
  return { txHash };
}

/**
 * Get the amount of vested tokens available to claim for a given address.
 */
export async function getAvailableVestedAmount(
  tokenAddress: `0x${string}`,
  account: `0x${string}`
): Promise<bigint> {
  const sdk = getDopplerSDK();
  const derc20 = sdk.getDerc20(tokenAddress);
  return derc20.getAvailableVestedAmount(account);
}
