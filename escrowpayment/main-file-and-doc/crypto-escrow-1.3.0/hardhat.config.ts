import 'dotenv/config'
import '@openzeppelin/hardhat-upgrades';
import { HardhatUserConfig, NetworksUserConfig } from "hardhat/types";
import { appChain, CHAINS } from "./chains";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const networks: NetworksUserConfig = {}

const chain = CHAINS[appChain];
let defaultNetwork = 'goerli'

defaultNetwork = chain.name.replaceAll(' ', '_').toLowerCase()
networks[defaultNetwork] = {
  url: chain.urls[0]??'',
  accounts: [process.env.DEPLOYER??'']
};

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: defaultNetwork,
  networks: networks
};

export default config;
