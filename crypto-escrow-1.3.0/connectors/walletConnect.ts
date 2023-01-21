import { appChain } from "./../chains";
import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect";
import { URLS } from "../chains";

const rpc: { [chainId: number]: string | string[] } = {};
rpc[appChain] = URLS[appChain];

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: rpc,
    }),
  Object.keys(URLS).map((chainId) => Number(chainId))
)
