import { ethers, upgrades } from 'hardhat'
import { join } from 'path'
import fs from 'fs/promises'

async function main() {
  const EscrowHub = await ethers.getContractFactory("EscrowHub");
  const EscrowHubProxy = await upgrades.deployProxy(EscrowHub, { kind: 'uups' })
  
  await EscrowHubProxy.deployed();

  const envData = await fs.readFile(join(__dirname, '../.env'), 'utf8');
  const envReplaceData = envData.replace(/__CONTRACT_ADDRESS__/g, EscrowHubProxy.address);
  await fs.writeFile(join(__dirname, '../.env'), envReplaceData, 'utf8');

  console.log("EscrowHub deployed to:", EscrowHubProxy.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });