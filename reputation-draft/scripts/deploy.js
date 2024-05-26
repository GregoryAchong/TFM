async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("deploy contrato con la account:", deployer.address);

    const CallPermitPrecompileAddress = "0x000000000000000000000000000000000000080A"; // Dirección precompilada para Moonbase Alpha
    
    const Reputation = await ethers.getContractFactory("Reputation");
    const reputation = await Reputation.deploy(CallPermitPrecompileAddress);

    console.log("Reputation adress:", reputation.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
