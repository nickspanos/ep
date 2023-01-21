import { useCallback, useEffect } from "react";
import { appChain, getAddChainParameters } from "../../chains";
import { coinbaseWallet, hooks } from "../../connectors/coinbaseWallet";
import Image from "next/image";
import CoinbaseSvg from "../../images/coinbase.svg";

const {
	useChainId,
	useAccounts,
	useError,
	useIsActivating,
	useIsActive,
	useProvider,
	useENSNames,
} = hooks;

export default function CoinbaseConnector() {
	const chainId = useChainId();

	const isActive = useIsActive();

	const chainParam = getAddChainParameters(appChain);

	const adjustChain = useCallback(async () => {
		// if we're already connected to the desired chain, return
		if (appChain === chainId) return;
		await coinbaseWallet.activate(chainParam);
	}, [chainId, chainParam]);

	// attempt to connect eagerly on mount
	useEffect(() => {
		void coinbaseWallet.connectEagerly();
	}, []);

	return (
		<div className="connector" onClick={adjustChain}>
			<Image src={CoinbaseSvg} width={50} height={50} alt="Coinbase"/>
			<span>{isActive?"Activated":"Coinbase"}</span>
		</div>
	);
};