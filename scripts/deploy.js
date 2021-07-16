/* eslint no-use-before-define: "warn" */
const { ethers } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");

const network = process.env.HARDHAT_NETWORK;

const deploy = async (args, owner) => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Deploying with args:", args);

  const factory = await ethers.getContractFactory("Tiles");

  const deployed = await factory.deploy(...args, {
    gasLimit: 6000000,
  });
  await deployed.deployTransaction.wait();

  const attached = factory.attach(deployed.address);

  console.log("Setting new owner:", owner);
  await attached.transferOwnership(owner, {
    gasLimit: 6000000,
  });

  const contractName = "Tiles";

  const contract = JSON.parse(
    fs
      .readFileSync(
        `artifacts/contracts/${contractName}.sol/${contractName}.json`
      )
      .toString()
  );

  fs.writeFileSync(
    `deployments/${network}/${contractName}.sol.address`,
    deployed.address
  );

  fs.writeFileSync(
    `deployments/${network}/${contractName}.abi.js`,
    `module.exports = ${JSON.stringify(contract.abi, null, 2)};`
  );

  console.log(
    chalk.green("   Done!"),
    "Deployed at:",
    chalk.magenta(deployed.address)
  );

  return deployed;
};

const main = async () => {
  const projectId = "0x02"; // Juicebox project https://juicebox.money/#/p/tiles
  const terminalDirectory = "0xd569D3CCE55b71a8a3f3C418c329A66e5f714431";
  const baseURI = "https://api.tiles.art/metadata/";
  const owner = "0x63A2368F4B509438ca90186cb1C15156713D5834";

  await deploy([projectId, terminalDirectory, baseURI], owner);

  console.log(
    "⚡️ All contract artifacts saved to:",
    chalk.yellow("packages/hardhat/artifacts/"),
    "\n"
  );

  console.log(
    chalk.green(" ✔ Deployed for network:"),
    process.env.HARDHAT_NETWORK,
    "\n"
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
