import { Clanker } from "clanker-sdk/v4";
import type { ClankerTokenV4 } from "clanker-sdk";
import {
  getAdminWalletClient,
  getPublicClient,
  getAdminAddress,
  getAdminAccount,
} from "./admin-wallet";
import { CONTRACTS, CLANKER_VAULT_ABI } from "./contracts";

function getClanker() {
  // Type assertion needed: project viem version may differ from SDK's bundled viem types
  return new Clanker({
    wallet: getAdminWalletClient(),
    publicClient: getPublicClient(),
  } as NonNullable<ConstructorParameters<typeof Clanker>[0]>);
}

export interface DeployTokenParams {
  name: string;
  symbol: string;
  imageUrl: string;
  requestKey: string;
}

export async function deployToken(params: DeployTokenParams) {
  const adminAddress = getAdminAddress();
  const tokenConfig: ClankerTokenV4 = {
    name: params.name,
    symbol: params.symbol,
    image: params.imageUrl,
    tokenAdmin: adminAddress,
    chainId: 8453,
    metadata: {
      description: `Launched via Pip for an X profile`,
    },
    context: {
      interface: "Pip",
      platform: "Pip",
      messageId: params.requestKey,
    },
    fees: {
      type: "static",
      clankerFee: 125,
      pairedFee: 125,
    },
    rewards: {
      recipients: [
        {
          admin: adminAddress,
          recipient: adminAddress,
          bps: 8000,
          token: "Paired",
        },
        {
          admin: adminAddress,
          recipient: adminAddress,
          bps: 2000,
          token: "Paired",
        },
      ],
    },
    vault: {
      percentage: 10,
      lockupDuration: 2592000, // 30 days
      vestingDuration: 2592000, // 30 days
      recipient: adminAddress,
    },
  };

  const clanker = getClanker();
  const result = await clanker.deploy(tokenConfig);

  if (result.error) {
    throw new Error(
      `Clanker deploy failed: ${result.error.data.label ?? result.error.message ?? "Unknown error"}`
    );
  }

  const txResult = await result.waitForTransaction();

  if (txResult.error) {
    throw new Error(
      `Deploy tx failed: ${txResult.error.data.label ?? txResult.error.message ?? "Unknown error"}`
    );
  }

  return {
    txHash: result.txHash,
    tokenAddress: txResult.address,
  };
}

export async function updateRewardRecipient(
  tokenAddress: `0x${string}`,
  rewardIndex: bigint,
  newRecipient: `0x${string}`
) {
  const clanker = getClanker();
  const result = await clanker.updateRewardRecipient({
    token: tokenAddress,
    rewardIndex,
    newRecipient,
  });

  if (result.error) {
    throw new Error(
      `updateRewardRecipient failed: ${result.error.data.label ?? "Unknown error"}`
    );
  }

  return { txHash: result.txHash };
}

export async function updateRewardAdmin(
  tokenAddress: `0x${string}`,
  rewardIndex: bigint,
  newAdmin: `0x${string}`
) {
  const clanker = getClanker();
  const result = await clanker.updateRewardAdmin({
    token: tokenAddress,
    rewardIndex,
    newAdmin,
  });

  if (result.error) {
    throw new Error(
      `updateRewardAdmin failed: ${result.error.data.label ?? "Unknown error"}`
    );
  }

  return { txHash: result.txHash };
}

export async function updateVaultBeneficiary(
  tokenAddress: `0x${string}`,
  newAdmin: `0x${string}`
) {
  const walletClient = getAdminWalletClient();
  const txHash = await walletClient.writeContract({
    address: CONTRACTS.clankerVault,
    abi: CLANKER_VAULT_ABI,
    functionName: "editAllocationAdmin",
    args: [tokenAddress, newAdmin],
    chain: walletClient.chain,
    account: getAdminAccount(),
  });

  return { txHash };
}

export async function claimFees(
  tokenAddress: `0x${string}`,
  rewardRecipient: `0x${string}`
) {
  const clanker = getClanker();
  const available = await clanker.availableRewards({
    token: tokenAddress,
    rewardRecipient,
  });

  if (available === 0n) {
    return { txHash: null, amount: 0n };
  }

  const result = await clanker.claimRewards({
    token: tokenAddress,
    rewardRecipient,
  });

  if (result.error) {
    throw new Error(
      `claimRewards failed: ${result.error.data.label ?? "Unknown error"}`
    );
  }

  return { txHash: result.txHash, amount: available };
}

export async function claimVaultedTokens(tokenAddress: `0x${string}`) {
  const clanker = getClanker();
  const result = await clanker.claimVaultedTokens({ token: tokenAddress });

  if (result.error) {
    throw new Error(
      `claimVaultedTokens failed: ${result.error.data.label ?? "Unknown error"}`
    );
  }

  return { txHash: result.txHash };
}

export async function getTokenRewards(tokenAddress: `0x${string}`) {
  const clanker = getClanker();
  return clanker.getTokenRewards({ token: tokenAddress });
}
