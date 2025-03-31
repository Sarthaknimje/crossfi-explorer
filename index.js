import { JsonRpcProvider } from 'ethers';

// Connect to the Ethereum network
const provider = new JsonRpcProvider("https://crossfi-mainnet.g.alchemy.com/v2/PDZKAQJRMlvYY4TZWPSmMwD9E2wkVo4e");

// Get block by number
const blockNumber = "latest";
const block = await provider.getBlock(blockNumber);

console.log(block);