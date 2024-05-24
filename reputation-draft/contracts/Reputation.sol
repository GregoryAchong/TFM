// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Reputation {
    // Map para reputacion de cada usuario
    mapping(address => uint256) public reputation;

    // Array de todas las direcciones de los usuarios
    address[] public users;

    // evento para cambios en la reputación
    event ReputationChanged(address indexed user, uint256 newReputation);

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
}
