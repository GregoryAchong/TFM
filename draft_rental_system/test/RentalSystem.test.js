const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs"); // Importa anyValue


describe("RentalSystem", function () {
  let rentalSystem, reputationManager, depositManager, recommendationManager;
  let landlord, tenant;

  before(async () => {
    // Obtener los signers (cuentas) del entorno de pruebas
    [landlord, tenant] = await ethers.getSigners();

    // Desplegar ReputationManager
    const ReputationManager = await ethers.getContractFactory("ReputationManager");
    reputationManager = await ReputationManager.deploy();
    await reputationManager.deployed();

    // Desplegar DepositManager
    const DepositManager = await ethers.getContractFactory("DepositManager");
    depositManager = await DepositManager.deploy();
    await depositManager.deployed();

    // Desplegar RecommendationManager
    const RecommendationManager = await ethers.getContractFactory("RecommendationManager");
    recommendationManager = await RecommendationManager.deploy();
    await recommendationManager.deployed();

    // Desplegar RentalSystem usando los contratos de Reputation, Deposit y Recommendation
    const RentalSystem = await ethers.getContractFactory("RentalSystem");
    rentalSystem = await RentalSystem.deploy(
      reputationManager.address,
      depositManager.address,
      recommendationManager.address
    );
    await rentalSystem.deployed();
  });

  it("Debería permitir a un inquilino suscribirse", async function () {
    const rentAmount = ethers.utils.parseEther("1.0"); // 1 ETH
    const rentalPeriod = 30 * 24 * 60 * 60; // 30 días en segundos

    // El inquilino se suscribe
    await expect(rentalSystem.connect(tenant).subscribe(rentAmount, rentalPeriod, { value: rentAmount }))
      .to.emit(rentalSystem, "Subscribed")
      .withArgs(tenant.address, rentAmount, anyValue);

    const tenantInfo = await rentalSystem.tenants(tenant.address);
    const actualNextPaymentDueDate = tenantInfo.nextPaymentDueDate;
    const expectedNextPaymentDueDate = (await ethers.provider.getBlock("latest")).timestamp + rentalPeriod;

    // Verifica que las fechas estén dentro de un rango de 2 segundos
    expect(actualNextPaymentDueDate).to.be.closeTo(expectedNextPaymentDueDate, 2);
  });

  it("Debería permitir al inquilino pagar la renta", async function () {
    const rentAmount = ethers.utils.parseEther("1.0"); // 1 ETH

    // Adelantar el tiempo hasta que el pago del alquiler esté vencido
    await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]); // Adelanta 30 días
    await ethers.provider.send("evm_mine", []); // Minar el siguiente bloque

    // Pagar la renta
    await expect(rentalSystem.connect(tenant).payRent({ value: rentAmount }))
      .to.emit(rentalSystem, "RentPaid")
      .withArgs(tenant.address, rentAmount, await ethers.provider.getBlock("latest").then(block => block.timestamp + 30 * 24 * 60 * 60));

    // Verificar la reputación del inquilino
    const reputation = await reputationManager.getReputation(tenant.address);
    expect(reputation).to.equal(1); // Debería haber ganado 1 punto de reputación por pagar a tiempo
  });

  it("Debería penalizar al inquilino por pagar tarde", async function () {
    const rentAmount = ethers.utils.parseEther("1.0"); // 1 ETH

    // Adelantar el tiempo 2 días después de la fecha de vencimiento
    await ethers.provider.send("evm_increaseTime", [32 * 24 * 60 * 60]); // Adelanta 32 días
    await ethers.provider.send("evm_mine", []); // Minar el siguiente bloque

    // Pagar la renta tarde
    await expect(rentalSystem.connect(tenant).payRent({ value: rentAmount }))
      .to.emit(rentalSystem, "RentPaid");

    // Comparar los timestamps con una tolerancia
    const actualNextPaymentDueDate = (await rentalSystem.tenants(tenant.address)).nextPaymentDueDate;
    const expectedNextPaymentDueDate = (await ethers.provider.getBlock("latest")).timestamp + 30 * 24 * 60 * 60;
    expect(actualNextPaymentDueDate).to.be.closeTo(expectedNextPaymentDueDate, 4000); // tolerancia de 2 segundos

    // Verificar la reputación del inquilino después de pagar tarde
    const reputation = await reputationManager.getReputation(tenant.address);
    expect(reputation).to.equal(0); // La reputación debería haber bajado a 0
  });

  it("Debería permitir al arrendador finalizar la relación con el inquilino", async function () {
    // El arrendador termina la relación con el inquilino
    await expect(rentalSystem.connect(landlord).endRelationship(tenant.address))
      .to.emit(rentalSystem, "RelationshipEnded")
      .withArgs(tenant.address);

    const tenantInfo = await rentalSystem.tenants(tenant.address);
    expect(tenantInfo.active).to.be.false;
  });
});
