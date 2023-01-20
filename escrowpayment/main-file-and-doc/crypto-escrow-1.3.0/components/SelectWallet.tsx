import MetaMaskCard from "../components/connectors/MetaMaskConnector";
import WalletConnectCard from "../components/connectors/WalletConnectConnector";
import CoinbaseConnector from "./connectors/CoinbaseConnector";

export const SelectWallet = () => (
    <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-md-8">
            <h1 className="text-center mb-5">Please Connect To A Wallet</h1>
            <div className="row justify-content-center align-items-center">
                <div className="col-md-4">
                    <MetaMaskCard />
                </div>
                <div className="col-md-4">
                    <CoinbaseConnector />
                </div>
                <div className="col-md-4">
                    <WalletConnectCard />
                </div>
            </div>
        </div>
    </div>
)