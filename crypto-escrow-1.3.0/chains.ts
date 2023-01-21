import type { AddEthereumChainParameter } from '@web3-react/types'

export const appChain = process.env.NEXT_PUBLIC_CHAIN?Number(process.env.NEXT_PUBLIC_CHAIN):31337

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}

interface BasicChainInformation {
  urls: string[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

export const CHAINS: { [chainId: number]: BasicChainInformation | ExtendedChainInformation } = {
  1: {
    urls: [
      process.env.NEXT_PUBLIC_INFURA_KEY ? `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : '',
      process.env.alchemyKey ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyKey}` : '',
      'https://cloudflare-eth.com',
    ].filter((url) => url),
    name: 'Mainnet',
  },
  3: {
    urls: [process.env.NEXT_PUBLIC_INFURA_KEY ? `https://ropsten.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : ''].filter(
      (url) => url
    ),
    name: 'Ropsten',
  },
  4: {
    urls: [process.env.NEXT_PUBLIC_INFURA_KEY ? `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : ''].filter(
      (url) => url
    ),
    name: 'Rinkeby',
  },
  5: {
    urls: [process.env.NEXT_PUBLIC_INFURA_KEY ? `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : ''].filter(
      (url) => url
    ),
    name: 'Goerli',
  },
  42: {
    urls: [process.env.NEXT_PUBLIC_INFURA_KEY ? `https://kovan.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : ''].filter(
      (url) => url
    ),
    name: 'Kovan',
  },
  // Optimism
  10: {
    urls: [
      process.env.NEXT_PUBLIC_INFURA_KEY ? `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : '',
      'https://mainnet.optimism.io',
    ].filter((url) => url),
    name: 'Optimism',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  69: {
    urls: [
      process.env.NEXT_PUBLIC_INFURA_KEY ? `https://optimism-kovan.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : '',
      'https://kovan.optimism.io',
    ].filter((url) => url),
    name: 'Optimism Kovan',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
  },
  // Arbitrum
  42161: {
    urls: [
      process.env.NEXT_PUBLIC_INFURA_KEY ? `https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : '',
      'https://arb1.arbitrum.io/rpc',
    ].filter((url) => url),
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  421611: {
    urls: [
      process.env.NEXT_PUBLIC_INFURA_KEY ? `https://arbitrum-rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : '',
      'https://rinkeby.arbitrum.io/rpc',
    ].filter((url) => url),
    name: 'Arbitrum Testnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
  },
  // Polygon
  137: {
    urls: [
      process.env.NEXT_PUBLIC_INFURA_KEY ? `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : '',
      'https://polygon-rpc.com',
    ].filter((url) => url),
    name: 'Polygon Mainnet',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  80001: {
    urls: [process.env.NEXT_PUBLIC_INFURA_KEY ? `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` : ''].filter(
      (url) => url
    ),
    name: 'Polygon Mumbai',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  31337: {
    urls: ['http://localhost:8545'],
    name: 'Localhost 8545',
    nativeCurrency: ETH,
    blockExplorerUrls: undefined,
  },
  // Binance
  56: {
    urls: [
      'https://bsc-dataseed.binance.org',
    ],
    name: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorerUrls: ['https://bscscan.com'],
  },
  97: {
    urls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
    ],
    name: 'Binance Smart Chain - Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  // Fantom
  250: {
    urls: [
      'https://rpc.ankr.com/fantom',
    ],
    name: 'Fantom Opera',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18
    },
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  4002: {
    urls: [
      'https://rpc.testnet.fantom.network',
    ],
    name: 'Fantom testnet',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18
    },
    blockExplorerUrls: ['https://testnet.ftmscan.com'],
  }
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {}
)
