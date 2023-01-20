// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import "dotenv/config"
import { join } from "path"
import fs from 'fs/promises'

async function main() {
  const minimum_escrow = process.env.NEXT_PUBLIC_MINIMUM_ESCROW??'0'
  const escrow_fee = process.env.NEXT_PUBLIC_ESCROW_FEE??'0'
  const data = await fs.readFile(join(__dirname, '../contracts/EscrowHub.sol.stub'), 'utf8');
  const result = data.replace(/__ENV_MINIMUM_ESCROW__/g, minimum_escrow).replace(/__ENV_FEE__/g, escrow_fee);
  await fs.writeFile(join(__dirname, '../contracts/EscrowHub.sol'), result, 'utf8');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });