/* eslint-disable no-await-in-loop */
/* eslint-disable no-console, no-inner-declarations, no-undef, import/no-unresolved */

const {ethers, upgrades} = require("hardhat");
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../.env")});
const fs = require("fs");

const pathOutputJson = path.join(__dirname, "./upgrade_output.json");

async function main() {
    const currentProvider = ethers.provider;
    let deployer;
    
    if (process.env.MNEMONIC) {
        deployer = ethers.HDNodeWallet.fromMnemonic(
            ethers.Mnemonic.fromPhrase(process.env.MNEMONIC),
            "m/44'/60'/0'/0/0"
        ).connect(currentProvider);
    } else {
        [deployer] = await ethers.getSigners();
    }
    
    //[deployer] = await ethers.getSigners();
    //console.log("deploy contrato con la account:", deployer.address);

    const digitalIdentityFactory = await ethers.getContractFactory("DigitalIdentity", deployer);
    const digitalIdentity = await upgrades.deployProxy(digitalIdentityFactory);

    await digitalIdentity.waitForDeployment();

    /*
    const DigitalIdentity = await ethers.getContractFactory("DigitalIdentityV3");
    const digitalIdentity = await DigitalIdentity.deploy();
    await digitalIdentity.deployed();
    */

    console.log("#######################\n");
    console.log("Proxy deployed to:", digitalIdentity.target);

    console.log("you can verify the proxy address with:");
    console.log(`npx hardhat verify ${digitalIdentity.target} --network ${process.env.HARDHAT_NETWORK}`);

    const output = {
        digitalIdentity: digitalIdentity.target,
    };
    fs.writeFileSync(pathOutputJson, JSON.stringify(output, null, 1));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
