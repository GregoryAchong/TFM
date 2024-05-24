const { ethers } = require("ethers");

// Conexión a la blockchain
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// ABI del contrato y dirección del contrato desplegado
const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newReputation",
          "type": "uint256"
        }
      ],
      "name": "ReputationChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "decreaseReputation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getReputation",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "increaseReputation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "reputation",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
const contractAddress = '0xC324B898ce52dD97f996bEd488aDBeef5a555CBF'; // Dirección del contrato desplegado

const reputationSystem = new ethers.Contract(contractAddress, contractABI, signer);

// Funciones para interactuar con el contrato
async function increaseReputation(userAddress, amount) {
    const tx = await reputationSystem.increaseReputation(userAddress, amount);
    await tx.wait();
    console.log("Reputation increased!");
}

async function decreaseReputation(userAddress, amount) {
    const tx = await reputationSystem.decreaseReputation(userAddress, amount);
    await tx.wait();
    console.log("Reputation decreased!");
}

async function getReputation(userAddress) {
    const reputation = await reputationSystem.getReputation(userAddress);
    console.log(`Reputation of ${userAddress}: ${reputation}`);
}
