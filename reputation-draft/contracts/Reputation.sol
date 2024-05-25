// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Reputation {
    // Structs rental y plan de pagos
    struct PaymentPlan {
        uint256 amount;
        uint256 dueDate;
        bool paid;
    }

    struct Rental {
        address tenant;
        uint256 startDate;
        uint256 endDate;
        PaymentPlan[] paymentPlans;
    }

    // Map para reputacion de cada usuario
    mapping(address => uint256) public reputation;

    // Map para alquiler de cada arrendatario
    mapping(address => Rental) public rentals;
   

    // Array de todas las direcciones de los usuarios
    address[] public users;

    // Owner para validar la creacion de alquileres
    address public owner;

    // evento para cambios en la reputación
    event ReputationChanged(address indexed user, uint256 newReputation);
    // evento para cambios alquiler y pagos
    event RentalCreated(address indexed tenant, uint256 startDate, uint256 endDate);
    event PaymentMade(address indexed tenant, uint256 amount, uint256 date);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // incrementar la reputación
    function increaseReputation(address user, uint256 amount) public {
        if(reputation[user] == 0) {
            users.push(user);
        }
        reputation[user] += amount;
        emit ReputationChanged(user, reputation[user]);
    }

    // disminuir la reputación de un usuario
    function decreaseReputation(address user, uint256 amount) public {
        require(reputation[user] >= amount, "reputacion debe ser mayor de 0");
        reputation[user] -= amount;
        emit ReputationChanged(user, reputation[user]);
    }

    // consultar la reputación de un usuario
    function getReputation(address user) public view returns (uint256) {
        return reputation[user];
    }

    // todas las reputaciones
    function getAllReputations() public view returns (address[] memory, uint256[] memory) {
        uint256[] memory reputations = new uint256[](users.length);
        for (uint256 i = 0; i < users.length; i++) {
            reputations[i] = reputation[users[i]];
        }
        return (users, reputations);
    }

    function createRental(address tenant, uint256 startDate, uint256 endDate, uint256[] memory amounts, uint256[] memory dueDates) public onlyOwner {
        require(rentals[tenant].tenant == address(0), "Rental already exists for this tenant");
        
        rentals[tenant].tenant = tenant;
        rentals[tenant].startDate = startDate;
        rentals[tenant].endDate = endDate;

        for (uint256 i = 0; i < amounts.length; i++) {
            rentals[tenant].paymentPlans.push(PaymentPlan({
                amount: amounts[i],
                dueDate: dueDates[i],
                paid: false
            }));
        }

        emit RentalCreated(tenant, startDate, endDate);
    }

    function makePayment(address tenant, uint256 paymentPlanIndex) public payable {
        Rental storage rental = rentals[tenant];
        PaymentPlan storage paymentPlan = rental.paymentPlans[paymentPlanIndex];

        require(!paymentPlan.paid, "Payment already made");
        require(msg.value == paymentPlan.amount, "Incorrect payment amount");

        paymentPlan.paid = true;
        emit PaymentMade(tenant, msg.value, block.timestamp);
    }

    function getRental(address tenant) public view returns (Rental memory) {
        return rentals[tenant];
    }

    function getPaymentPlans(address tenant) public view returns (PaymentPlan[] memory) {
        return rentals[tenant].paymentPlans;
    }
}
