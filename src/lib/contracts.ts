export const CONTRACTS = {
  weth: "0x4200000000000000000000000000000000000006" as const,
  pipaiToken: "0xd839b62b2035c313968965d7a24818bc6a38eb07" as const,
} as const;

/** Basescan URL for the $PIPAI token */
export const PIPAI_TOKEN_URL = `https://basescan.org/token/${CONTRACTS.pipaiToken}`;

/** DEX Screener URL for the $PIPAI token on Base */
export const PIPAI_DEXSCREENER_URL = `https://dexscreener.com/base/${CONTRACTS.pipaiToken}`;
