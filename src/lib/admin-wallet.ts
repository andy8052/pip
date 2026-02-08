import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

function getAccount() {
  return privateKeyToAccount(
    process.env.ADMIN_PRIVATE_KEY as `0x${string}`
  );
}

export function getAdminWalletClient() {
  return createWalletClient({
    account: getAccount(),
    chain: base,
    transport: http(process.env.BASE_RPC_URL),
  });
}

export function getPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL),
  });
}

export function getAdminAddress() {
  return process.env.ADMIN_WALLET_ADDRESS as `0x${string}`;
}

export function getAdminAccount() {
  return getAccount();
}
