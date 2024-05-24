require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/DTBx5-V2b1xsWJs1BGqDv038oh0qUNrG",
      accounts: ["b7107950a7ba6b56efe45f4944a21fcf2a2173d9199026978730330f3faf0b99"]
    }
  }
};
  