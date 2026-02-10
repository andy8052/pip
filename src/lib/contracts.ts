export const CONTRACTS = {
  clankerFactoryV4: "0xE85A59c628F7d27878ACeB4bf3b35733630083a9" as const,
  clankerFeeLockerV4: "0xF3622742b1E446D92e45E22923Ef11C2fcD55D68" as const,
  clankerVault: "0x8E845EAd15737bF71904A30BdDD3aEE76d6ADF6C" as const,
  weth: "0x4200000000000000000000000000000000000006" as const,
  pipaiToken: "0xd839b62b2035c313968965d7a24818bc6a38eb07" as const,
} as const;

/** Basescan URL for the $PIPAI token */
export const PIPAI_TOKEN_URL = `https://basescan.org/token/${CONTRACTS.pipaiToken}`;

/** DEX Screener URL for the $PIPAI token on Base */
export const PIPAI_DEXSCREENER_URL = `https://dexscreener.com/base/${CONTRACTS.pipaiToken}`;

// ClankerVault ABI — only the functions we need
export const CLANKER_VAULT_ABI = [
  {
    type: "function",
    name: "editAllocationAdmin",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "newAdmin", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allocation",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "amountTotal", type: "uint256", internalType: "uint256" },
      { name: "amountClaimed", type: "uint256", internalType: "uint256" },
      { name: "lockupEndTime", type: "uint256", internalType: "uint256" },
      { name: "vestingEndTime", type: "uint256", internalType: "uint256" },
      { name: "admin", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claim",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "amountAvailableToClaim",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;
