const CONTRACT_ADDRESS = '0x2D098d188c3CD6c2d627dcc2B6b84607f4b5b70F'; // contrato
const CONTRACT_ABI = [
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
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorizedUsers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
    "name": "decreaseReputation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllReputations",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
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
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let reputationSystem;

document.getElementById('connectButton').onclick = async () => {
    await connectWallet();
};

document.getElementById('increaseButton').onclick = async () => {
    const address = document.getElementById('address').value;
    const amount = parseInt(document.getElementById('amount').value);
    await increaseReputation(address, amount);
};

document.getElementById('decreaseButton').onclick = async () => {
    const address = document.getElementById('address').value;
    const amount = parseInt(document.getElementById('amount').value);
    await decreaseReputation(address, amount);
};

document.getElementById('getReputationButton').onclick = async () => {
    const address = document.getElementById('address').value;
    await getReputation(address);
};

document.getElementById('getAllReputationsButton').onclick = async () => {
    await getAllReputations();
};

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Solicitar acceso a la cuenta del usuario
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            document.getElementById('userAddress').textContent = userAddress;
            document.getElementById('userInfo').style.display = 'block';

            reputationSystem = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        } catch (error) {
            console.error("User rejected the request:", error);
            alert('Failed to connect wallet');
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this application.');
    }
}

async function increaseReputation(userAddress, amount) {
    try {
        const tx = await reputationSystem.increaseReputation(userAddress, amount);
        await tx.wait();
        console.log("Reputation increased!");
    } catch (error) {
        console.error("Failed to increase reputation:", error);
        alert('Failed to increase reputation');
    }
}

async function decreaseReputation(userAddress, amount) {
    try {
        const tx = await reputationSystem.decreaseReputation(userAddress, amount);
        await tx.wait();
        console.log("Reputation decreased!");
    } catch (error) {
        console.error("Failed to decrease reputation:", error);
        alert('Failed to decrease reputation');
    }
}

async function getReputation(userAddress) {
    try {
        const reputation = await reputationSystem.getReputation(userAddress);
        document.getElementById('reputation').textContent = `Reputation of ${userAddress}: ${reputation}`;
    } catch (error) {
        console.error("Failed to get reputation:", error);
        alert('Failed to get reputation');
    }
}

async function getAllReputations() {
    try {
        const [addresses, reputations] = await reputationSystem.getAllReputations();
        const allReputationsDiv = document.getElementById('allReputations');
        allReputationsDiv.innerHTML = '<h2>All Reputations</h2>';
        for (let i = 0; i < addresses.length; i++) {
            const p = document.createElement('p');
            p.textContent = `Address: ${addresses[i]}, Reputation: ${reputations[i]}`;
            allReputationsDiv.appendChild(p);
        }
    } catch (error) {
        console.error("Failed to get all reputations:", error);
        alert('Failed to get all reputations');
    }
}
