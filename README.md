# Sample Hardhat Project
$ npm init -y

$ npm i hardhat

$ npx hardhat init

$ code .

$ npm install @openzeppelin/contracts-upgradeable

$ npm install --save-dev hardhat-dependency-compiler

$ npm install --save-dev @openzeppelin/hardhat-upgrades
$ npm install --save-dev @nomicfoundation/hardhat-ethers ethers # peer dependencies

$ npm install --save-dev prettier prettier-plugin-solidity
$ npx prettier --write --plugin=prettier-plugin-solidity 'contracts/**/*.sol'

$ npm install @openzeppelin/contracts

$ npm install dotenv --save

$ npm install --save-dev @nomicfoundation/hardhat-verify

$ npx hardhat run scripts/deploy-smart-contract.js --network moonbase

$ npx hardhat verify 0X000000000000000000000000000 --network moonbase

$ npx hardhat run scripts/upgrade-smart-contract.js --network moonbase
