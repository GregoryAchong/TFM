require("@nomicfoundation/hardhat-toolbox");
//require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `${process.env.SEPOLIA_PROJECT_ID}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`]
    },
    hardhat: {
      chainId: 1337
    }
  }
};
  