async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("deploy contrato con la account:", deployer.address);

    const Reputation = await ethers.getContractFactory("Reputation");
    const reputation = await Reputation.deploy();

    console.log("Reputation adress:", reputation.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });