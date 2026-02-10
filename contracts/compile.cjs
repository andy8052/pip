#!/usr/bin/env node
/**
 * Compile BeneficiaryFeeRouter.sol and output ABI + bytecode as a TypeScript
 * module that can be imported by the app.
 */
const solc = require("solc");
const fs = require("fs");
const path = require("path");

const contractPath = path.join(__dirname, "BeneficiaryFeeRouter.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "BeneficiaryFeeRouter.sol": { content: source },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const errs = output.errors.filter((e) => e.severity === "error");
  if (errs.length > 0) {
    console.error("Compilation errors:");
    errs.forEach((e) => console.error(e.formattedMessage));
    process.exit(1);
  }
  // Print warnings
  output.errors
    .filter((e) => e.severity === "warning")
    .forEach((e) => console.warn(e.formattedMessage));
}

const contract =
  output.contracts["BeneficiaryFeeRouter.sol"]["BeneficiaryFeeRouter"];

const abi = JSON.stringify(contract.abi, null, 2);
const bytecode = "0x" + contract.evm.bytecode.object;

const outPath = path.join(__dirname, "..", "src", "lib", "fee-router-artifact.ts");

const tsContent = `// Auto-generated — do not edit. Run: node contracts/compile.cjs
import type { Abi } from "viem";

export const BENEFICIARY_FEE_ROUTER_ABI = ${abi} as const satisfies Abi;

export const BENEFICIARY_FEE_ROUTER_BYTECODE = "${bytecode}" as const;
`;

fs.writeFileSync(outPath, tsContent, "utf8");
console.log(`✓ Wrote ${outPath}`);
console.log(`  ABI entries: ${contract.abi.length}`);
console.log(`  Bytecode size: ${bytecode.length / 2 - 1} bytes`);
