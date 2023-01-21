import "bootstrap/dist/css/bootstrap.css";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";

import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import {
	coinbaseWallet,
	hooks as coinbaseWalletHooks,
} from "../connectors/coinbaseWallet";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import {
	hooks as walletConnectHooks,
	walletConnect,
} from "../connectors/walletConnect";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const connectors: [
	MetaMask | WalletConnect | CoinbaseWallet,
	Web3ReactHooks
][] = [
	[metaMask, metaMaskHooks],
	[walletConnect, walletConnectHooks],
	[coinbaseWallet, coinbaseWalletHooks],
];

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
			</Head>
			<Web3ReactProvider connectors={connectors}>
				<QueryClientProvider client={queryClient}>
					<Toaster position="bottom-right" reverseOrder={true} />
					<Component {...pageProps} />
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</Web3ReactProvider>
		</>
	);
}
