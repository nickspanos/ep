import { EscrowHub } from './../types/EscrowHub';
import { createContext } from "react"

type EscrowContextProps = {
    symbol: string;
    signerAddress: string | undefined;
    escrowContract: EscrowHub | undefined;
    provider: any;
    ensName: any;
    ensAvatar: any;
}

export const EscrowContext = createContext<EscrowContextProps>({
    symbol: "ETH",
    signerAddress: undefined,
    escrowContract: undefined,
    provider: null,
    ensName: null,
    ensAvatar: null
})