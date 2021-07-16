require("hardhat-deploy");
require("hardhat-deploy-ethers");

const fs = require("fs");

function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    console.log("Couldn't read mnemonic", e);
  }
  return "";
}

function deployerPk() {
  try {
    return fs.readFileSync("./pk.txt").toString().trim();
  } catch (e) {
    console.log("Couldn't read pk", e);
  }
  return "";
}

const infuraId = "0e8a1922865f444683f5d0507139d739";

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [
        {
          privateKey:
            "c6cbd7d76bc5baca530c875663711b947efa6a86a900a9e8645ce32e5821484e",
          balance: "1000000000000000000000",
        },
      ],
    },
    localhost: {
      url: "http://localhost:8545",
    },
    kovan: {
      url: "https://kovan.infura.io/v3/" + infuraId,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + infuraId,
      accounts: [ deployerPk() ],
      gasPrice: 42000000000
    },
  },
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
    dev: 1,
    fee: 2,
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};
