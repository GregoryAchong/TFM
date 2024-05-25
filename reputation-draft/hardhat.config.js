require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    moonbase: {
      url: `${process.env.MOONBASE_PROJECT_ID}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`]
    }
  }
};
  