import { Clanker } from "clanker-sdk/v4";
import {
  getAdminWalletClient,
  getPublicClient,
  getAdminAddress,
  getAdminAccount,
} from "./admin-wallet";
import { CONTRACTS, CLANKER_VAULT_ABI } from "./contracts";

// Extract the token config type from the deploy method signature
type ClankerTokenV4 = Parameters<InstanceType<typeof Clanker>["deploy"]>[0];

function getClanker() {
  return new Clanker({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wallet: getAdminWalletClient() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publicClient: getPublicClient() as any,
  });
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

  if ("error" in result && result.error) {
    const err = result.error as { data?: { label?: string }; error?: { message?: string } };
    throw new Error(`Clanker deploy failed: ${err.data?.label ?? err.error?.message ?? "Unknown error"}`);
  }

  const { txHash, waitForTransaction } = result as {
    txHash: `0x${string}`;
    waitForTransaction: () => Promise<
      { address: `0x${string}`; error?: undefined } | { address?: undefined; error: unknown }
    >;
  };

  const txResult = await waitForTransaction();

  if ("error" in txResult && txResult.error) {
    throw new Error(`Deploy tx failed`);
  }

  return {
    txHash,
    tokenAddress: txResult.address!,
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

  if ("error" in result && result.error) {
    const err = result.error as { data?: { label?: string } };
    throw new Error(
      `updateRewardRecipient failed: ${err.data?.label ?? "Unknown error"}`
    );
  }

  return { txHash: (result as { txHash: `0x${string}` }).txHash };
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

  if (available === BigInt(0)) {
    return { txHash: null, amount: BigInt(0) };
  }

  const result = await clanker.claimRewards({
    token: tokenAddress,
    rewardRecipient,
  });

  if ("error" in result && result.error) {
    const err = result.error as { data?: { label?: string } };
    throw new Error(
      `claimRewards failed: ${err.data?.label ?? "Unknown error"}`
    );
  }

  return { txHash: (result as { txHash: `0x${string}` }).txHash, amount: available };
}

export async function getTokenRewards(tokenAddress: `0x${string}`) {
  const clanker = getClanker();
  return clanker.getTokenRewards({ token: tokenAddress });
}
