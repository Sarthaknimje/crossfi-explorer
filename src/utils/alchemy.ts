import { Alchemy, Network } from "alchemy-sdk";
import { JsonRpcProvider } from "ethers";

// Replace with your Alchemy API key
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "PDZKAQJRMlvYY4TZWPSmMwD9E2wkVo4e";

// Alchemy SDK configuration for CrossFi
export const alchemyConfig = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // This will be updated when CrossFi has its own Network enum
};

// Initialize Alchemy SDK
export const alchemy = new Alchemy(alchemyConfig);

// For direct JsonRpcProvider usage (alternative to Alchemy SDK)
export const provider = new JsonRpcProvider(
  `https://crossfi-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
);

// CrossFi Chain ID
export const CROSSFI_CHAIN_ID = "crossfi-evm-1"; // Replace with actual Chain ID when available

