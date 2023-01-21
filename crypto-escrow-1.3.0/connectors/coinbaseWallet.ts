import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { appChain, URLS } from '../chains'

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet(actions, {
      url: URLS[appChain][0],
      appName: process?.env?.NEXT_PUBLIC_APP_NAME??''
    })
)