export interface TokenLaunch {
  id: string;
  launcherUserId: string;
  targetTwitterUsername: string;
  targetTwitterName: string | null;
  targetTwitterProfilePicture: string | null;
  tokenAddress: string | null;
  tokenName: string;
  tokenSymbol: string;
  tokenImageUrl: string | null;
  deployTxHash: string | null;
  poolAddress: string | null;
  clankerRequestKey: string;
  status: "pending" | "deploying" | "deployed" | "failed";
  claimed: boolean;
  claimedByUserId: string | null;
  claimedAt: Date | null;
  claimerWalletAddress: string | null;
  claimTxHash: string | null;
  vaultClaimTxHash: string | null;
  createdAt: Date;
}

export interface AppUser {
  id: string;
  privyDid: string;
  twitterUsername: string | null;
  twitterName: string | null;
  twitterProfilePicture: string | null;
  walletAddress: string | null;
  createdAt: Date;
}

export interface FeeCollection {
  id: string;
  launchId: string;
  tokenAddress: string;
  amountWei: string;
  txHash: string;
  collectedAt: Date;
}

export interface LaunchFormData {
  targetTwitterUsername: string;
  targetTwitterName: string;
  targetTwitterProfilePicture: string;
  tokenName: string;
  tokenSymbol: string;
  tokenImageUrl: string;
}
