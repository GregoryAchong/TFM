// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ReputationManager.sol";
import "./DepositManager.sol";
import "./RecommendationManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RentalSystem is ReentrancyGuard, AccessControl {
    using SafeMath for uint256;

    ReputationManager public reputationManager;
    DepositManager public depositManager;
    RecommendationManager public recommendationManager;

    struct Tenant {
        address tenantAddress;
        uint256 rentAmount;
        uint256 nextPaymentDueDate;
        bool active;
        uint256 pendingAmount;
    }

    bytes32 public constant LANDLORD_ROLE = keccak256("LANDLORD_ROLE");
    mapping(address => Tenant) public tenants;
    address public landlord;
    bool public paused = false;

    event Subscribed(address indexed tenant, uint256 rentAmount, uint256 nextPaymentDueDate);
    event RentPaid(address indexed tenant, uint256 amount, uint256 nextPaymentDueDate);
    event Unsubscribed(address indexed tenant);
    event RelationshipEnded(address indexed tenant);
    event Paused();
    event Unpaused();

    modifier onlyLandlord() {
        require(hasRole(LANDLORD_ROLE, msg.sender), "Only landlord can perform this action");
        _;
    }

    modifier onlyTenant() {
        require(tenants[msg.sender].tenantAddress == msg.sender, "Only tenant can perform this action");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor(address _reputationManager, address _depositManager, address _recommendationManager) {
        reputationManager = ReputationManager(_reputationManager);
        depositManager = DepositManager(_depositManager);
        recommendationManager = RecommendationManager(_recommendationManager);
        _setupRole(LANDLORD_ROLE, msg.sender); // explain
        landlord = msg.sender; // explain
    }

    function subscribe(uint256 rentAmount, uint256 rentalPeriod) external payable whenNotPaused {
        require(tenants[msg.sender].tenantAddress == address(0), "Already subscribed");
        require(msg.value == rentAmount, "Initial payment must equal rent amount");

        tenants[msg.sender] = Tenant({
            tenantAddress: msg.sender,
            rentAmount: rentAmount,
            nextPaymentDueDate: block.timestamp + rentalPeriod,
            active: true,
            pendingAmount: 0
        });

        depositManager.createDeposit{value: msg.value}(msg.sender, rentAmount, block.timestamp + rentalPeriod);
        emit Subscribed(msg.sender, rentAmount, block.timestamp + rentalPeriod);
    }

    function payRent() external payable onlyTenant nonReentrant whenNotPaused {
        Tenant storage tenant = tenants[msg.sender];
        require(tenant.active, "Subscription not active");
        require(block.timestamp >= tenant.nextPaymentDueDate, "Payment not due yet");

        uint256 totalDue = tenant.rentAmount.add(tenant.pendingAmount);
        require(msg.value > 0, "Payment must be greater than zero");
        require(msg.value <= totalDue, "Overpayment not allowed");

        tenant.pendingAmount = totalDue.sub(msg.value);

        (bool success, ) = payable(landlord).call{value: msg.value}("");
        require(success, "Payment transfer failed");

        if (tenant.pendingAmount == 0) {
            tenant.nextPaymentDueDate = tenant.nextPaymentDueDate.add(30 days);
            if (block.timestamp <= tenant.nextPaymentDueDate + 1 days) {
                reputationManager.increaseReputation(msg.sender, 1); // Suma 1 punto si paga a tiempo
            } else {
                reputationManager.decreaseReputation(msg.sender, 1); // Resta 1 punto si paga tarde
            }
            emit RentPaid(msg.sender, msg.value, tenant.nextPaymentDueDate);
        }
    }

    function unsubscribe() external onlyTenant whenNotPaused {
        tenants[msg.sender].active = false;
        emit Unsubscribed(msg.sender);
    }

    function endRelationship(address tenantAddress) external onlyLandlord whenNotPaused {
        Tenant storage tenant = tenants[tenantAddress];
        require(tenant.active, "Tenant is not active");

        tenant.active = false;
        emit RelationshipEnded(tenantAddress);
    }

    function pause() external onlyLandlord {
        paused = true;
        emit Paused();
    }

    function unpause() external onlyLandlord {
        paused = false;
        emit Unpaused();
    }
}
