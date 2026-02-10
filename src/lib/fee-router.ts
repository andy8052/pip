/**
 * Helpers for deploying and interacting with BeneficiaryFeeRouter contracts.
 *
 * Each Doppler token launch deploys its own fee router contract that is set as
 * the on-chain beneficiary. Because Doppler beneficiaries are immutable, the
 * router acts as a mutable intermediary — the admin can point it at the real
 * creator wallet once they claim, and fees are forwarded on demand.
 */
import type { Address, Hash } from "viem";
import {
  BENEFICIARY_FEE_ROUTER_ABI,
  BENEFICIARY_FEE_ROUTER_BYTECODE,
} from "./fee-router-artifact";
import {
  getAdminWalletClient,
  getPublicClient,
  getAdminAddress,
} from "./admin-wallet";
import { CONTRACTS } from "./contracts";

// ── Deploy ────────────────────────────────────────────────────────────────────

/**
 * Deploy a new BeneficiaryFeeRouter contract owned by the admin wallet.
 * Returns the deployed contract address and the transaction hash.
 */
export async function deployFeeRouter(): Promise<{
  routerAddress: Address;
  txHash: Hash;
}> {
  const walletClient = getAdminWalletClient();
  const publicClient = getPublicClient();
  const adminAddress = getAdminAddress();

  const txHash = await walletClient.deployContract({
    abi: BENEFICIARY_FEE_ROUTER_ABI,
    bytecode: BENEFICIARY_FEE_ROUTER_BYTECODE,
    args: [adminAddress],
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  if (!receipt.contractAddress) {
    throw new Error(
      `Fee router deployment failed — no contract address in receipt (tx: ${txHash})`
    );
  }

  return { routerAddress: receipt.contractAddress, txHash };
}

// ── Set Recipient ─────────────────────────────────────────────────────────────

/**
 * Set the recipient on a fee router contract. Only callable by the owner
 * (admin wallet). This is called when a creator claims their token.
 */
export async function setFeeRouterRecipient(
  routerAddress: Address,
  recipientAddress: Address
): Promise<{ txHash: Hash }> {
  const walletClient = getAdminWalletClient();
  const publicClient = getPublicClient();

  const txHash = await walletClient.writeContract({
    address: routerAddress,
    abi: BENEFICIARY_FEE_ROUTER_ABI,
    functionName: "setRecipient",
    args: [recipientAddress],
  });

  await publicClient.waitForTransactionReceipt({ hash: txHash });

  return { txHash };
}

// ── Forward Fees ──────────────────────────────────────────────────────────────

/**
 * Forward accumulated WETH fees from the router to its configured recipient.
 * Returns null if the router has no WETH balance or no recipient set.
 */
export async function forwardRouterFees(
  routerAddress: Address
): Promise<{ txHash: Hash } | null> {
  const walletClient = getAdminWalletClient();
  const publicClient = getPublicClient();
  const wethAddress = CONTRACTS.weth as Address;

  // Check if a recipient is set
  const recipient = await publicClient.readContract({
    address: routerAddress,
    abi: BENEFICIARY_FEE_ROUTER_ABI,
    functionName: "recipient",
  });

  if (recipient === "0x0000000000000000000000000000000000000000") {
    return null; // No recipient set yet — fees stay in the router
  }

  // Check WETH balance
  const balance = await publicClient.readContract({
    address: wethAddress,
    abi: [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ] as const,
    functionName: "balanceOf",
    args: [routerAddress],
  });

  if (balance === 0n) {
    return null; // No fees to forward
  }

  const txHash = await walletClient.writeContract({
    address: routerAddress,
    abi: BENEFICIARY_FEE_ROUTER_ABI,
    functionName: "forward",
    args: [wethAddress],
  });

  await publicClient.waitForTransactionReceipt({ hash: txHash });

  return { txHash };
}

// ── Read Helpers ──────────────────────────────────────────────────────────────

/**
 * Get the current recipient address configured on a fee router.
 */
export async function getFeeRouterRecipient(
  routerAddress: Address
): Promise<Address> {
  const publicClient = getPublicClient();
  return publicClient.readContract({
    address: routerAddress,
    abi: BENEFICIARY_FEE_ROUTER_ABI,
    functionName: "recipient",
  }) as Promise<Address>;
}

/**
 * Get the WETH balance sitting in a fee router contract.
 */
export async function getFeeRouterBalance(
  routerAddress: Address
): Promise<bigint> {
  const publicClient = getPublicClient();
  const wethAddress = CONTRACTS.weth as Address;

  return publicClient.readContract({
    address: wethAddress,
    abi: [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ] as const,
    functionName: "balanceOf",
    args: [routerAddress],
  });
}
