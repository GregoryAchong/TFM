// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RentalContract is ReentrancyGuard, AccessControl {
    using SafeMath for uint256;

    struct Tenant {
        address tenantAddress;
        uint256 rentAmount;
        uint256 nextPaymentDueDate;
        uint256 points;
        bool active;
        uint256 pendingAmount;
    }

    bytes32 public constant LANDLORD_ROLE = keccak256("LANDLORD_ROLE");
    bool public paused = false;
    mapping(address => Tenant) public tenants;
    address public landlord;

    event Subscribed(address indexed tenant, uint256 rentAmount, uint256 nextPaymentDueDate);
    event RentPaid(address indexed tenant, uint256 amount, uint256 nextPaymentDueDate);
    event PaymentFailed(address indexed tenant, uint256 amountDue, string message);
    event Unsubscribed(address indexed tenant);
    event RelationshipEnded(address indexed tenant);
    event RewardGranted(address indexed tenant, uint256 points);
    event PenaltyImposed(address indexed tenant, uint256 points);
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

  

    /**
     * @dev Subscribe a new tenant with a specified rent amount and rental period.
     * @param rentAmount The amount of rent to be paid.
     * @param rentalPeriod The duration of the rental period in seconds.
     */
    function subscribe(uint256 rentAmount, uint256 rentalPeriod) external payable whenNotPaused {
        require(tenants[msg.sender].tenantAddress == address(0), "Already subscribed");
        require(msg.value == rentAmount, "Initial payment must be equal to the rent amount");

        tenants[msg.sender] = Tenant({
            tenantAddress: msg.sender,
            rentAmount: rentAmount,
            nextPaymentDueDate: block.timestamp + rentalPeriod,
            points: 0,
            active: true,
            pendingAmount: 0
        });

        emit Subscribed(msg.sender, rentAmount, block.timestamp + rentalPeriod);
    }

    /**
     * @dev Allows a tenant to pay rent. Supports partial payments.
     */
    function payRent() external payable onlyTenant nonReentrant whenNotPaused {
        Tenant storage tenant = tenants[msg.sender];
        require(tenant.active, "Subscription not active");
        require(block.timestamp >= tenant.nextPaymentDueDate, "Payment not due yet");

        uint256 totalDue = tenant.rentAmount.add(tenant.pendingAmount);
        require(msg.value > 0, "Payment must be greater than zero");
        require(msg.value <= totalDue, "Overpayment not allowed");

        tenant.pendingAmount = totalDue.sub(msg.value);

        if (msg.value > 0) {
            (bool success, ) = payable(landlord).call{value: msg.value}("");
            require(success, "Payment transfer failed");
        }

        if (tenant.pendingAmount == 0) {
            tenant.nextPaymentDueDate = tenant.nextPaymentDueDate.add(30 days);
            if (block.timestamp <= tenant.nextPaymentDueDate + 1 days) {
                tenant.points = tenant.points.add(1);
                emit RewardGranted(msg.sender, tenant.points);
            } else {
                tenant.points = tenant.points > 0 ? tenant.points.sub(1) : 0;
                emit PenaltyImposed(msg.sender, tenant.points);
            }
            emit RentPaid(msg.sender, msg.value, tenant.nextPaymentDueDate);
        } else {
            emit PaymentFailed(msg.sender, tenant.pendingAmount, "Partial payment made, full rent not covered");
        }
    }

    /**
     * @dev Allows a tenant to unsubscribe.
     */
    function unsubscribe() external onlyTenant whenNotPaused {
        tenants[msg.sender].active = false;
        emit Unsubscribed(msg.sender);
    }

    /**
     * @dev Allows the landlord to end the relationship with a tenant.
     * @param tenantAddress The address of the tenant to end the relationship with.
     */
    function endRelationship(address tenantAddress) external onlyLandlord whenNotPaused {
        Tenant storage tenant = tenants[tenantAddress];
        require(tenant.active, "Tenant is not active");

        tenant.active = false;
        emit RelationshipEnded(tenantAddress);
    }

    /**
     * @dev Check the payment status of a tenant.
     * @param tenantAddress The address of the tenant.
     * @return A string indicating the payment status.
     */
    function checkPaymentStatus(address tenantAddress) external view returns (string memory) {
        Tenant memory tenant = tenants[tenantAddress];
        if (!tenant.active) {
            return "Subscription not active";
        }
        if (block.timestamp >= tenant.nextPaymentDueDate) {
            return "Payment due";
        } else {
            return "Payment up to date";
        }
    }

    /**
     * @dev Get the points of a tenant.
     * @param tenantAddress The address of the tenant.
     * @return The number of points of the tenant.
     */
    function getTenantPoints(address tenantAddress) external view returns (uint256) {
        return tenants[tenantAddress].points;
    }

    /**
     * @dev Allows the landlord to withdraw the contract balance.
     */
    function withdraw() external onlyLandlord nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(_msgSender()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    /**
     * @dev Pause the contract.
     */
    function pause() external onlyLandlord {
        paused = true;
        emit Paused();
    }

    /**
     * @dev Unpause the contract.
     */
    function unpause() external onlyLandlord {
        paused = false;
        emit Unpaused();
    }

    receive() external payable {}
}
