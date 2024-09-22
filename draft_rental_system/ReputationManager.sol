// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReputationManager {
    mapping(address => uint256) public reputations;

    event ReputationUpdated(address user, uint256 change);
    event RewardGranted(address indexed user, int256 points);
    event PenaltyImposed(address indexed user, int256 points);

    function increaseReputation(address user, uint256 amount) external {
        reputations[user] += amount;
        emit ReputationUpdated(user, reputations[user]);
        emit RewardGranted(user, int256(amount));
    }

    function decreaseReputation(address user, uint256 amount) external {
        require(reputations[user] >= amount, "Reputation can't be negative");
        reputations[user] -= amount;
        emit ReputationUpdated(user, reputations[user]);
        emit PenaltyImposed(user, -int256(amount));
    }

    function getReputation(address user) external view returns (uint256) {
        return reputations[user];
    }
}
