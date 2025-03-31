// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null),
  }),
}));

// Mock Alchemy SDK
jest.mock('../utils/alchemy', () => ({
  alchemy: {
    core: {
      getTokenBalances: jest.fn().mockResolvedValue({ tokenBalances: [] }),
      getAssetTransfers: jest.fn().mockResolvedValue({ transfers: [] }),
      getBlockWithTransactions: jest.fn().mockResolvedValue({ transactions: [] }),
      getTokenMetadata: jest.fn().mockResolvedValue({
        name: 'Mock Token',
        symbol: 'MOCK',
        decimals: 18,
        logo: '',
      }),
    },
    nft: {
      getNftsForOwner: jest.fn().mockResolvedValue({ ownedNfts: [] }),
    },
  },
}));

// Mock toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
    isMetaMask: true,
  },
  writable: true,
}); 