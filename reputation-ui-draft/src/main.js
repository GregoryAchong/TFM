const CONTRACT_ADDRESS = '0xBA1AF1363308D3f52303d0B0a843126518ae6A9A'; // contrato
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "tenant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "date",
        "type": "uint256"
      }
    ],
    "name": "PaymentMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "tenant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      }
    ],
    "name": "RentalCreated",
    "type": "event"
  },
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
        "name": "tenant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "dueDates",
        "type": "uint256[]"
      }
    ],
    "name": "createRental",
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
        "name": "tenant",
        "type": "address"
      }
    ],
    "name": "getPaymentPlans",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "dueDate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "paid",
            "type": "bool"
          }
        ],
        "internalType": "struct Reputation.PaymentPlan[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tenant",
        "type": "address"
      }
    ],
    "name": "getRental",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tenant",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endDate",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "dueDate",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "paid",
                "type": "bool"
              }
            ],
            "internalType": "struct Reputation.PaymentPlan[]",
            "name": "paymentPlans",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct Reputation.Rental",
        "name": "",
        "type": "tuple"
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
        "name": "tenant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "paymentPlanIndex",
        "type": "uint256"
      }
    ],
    "name": "makePayment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
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
    "name": "rentals",
    "outputs": [
      {
        "internalType": "address",
        "name": "tenant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endDate",
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

document.getElementById('createRentalButton').onclick = async () => {
  const tenant = document.getElementById('address').value;
  const startDate = Math.floor(Date.now() / 1000); // Current date in seconds
  const endDate = startDate + (365 * 24 * 60 * 60); // One year later
  const amounts = [1000, 1000, 1000]; // Example amounts
  const dueDates = [startDate + (30 * 24 * 60 * 60), startDate + (60 * 24 * 60 * 60), startDate + (90 * 24 * 60 * 60)]; // Due dates for 3 months
  await createRental(tenant, startDate, endDate, amounts, dueDates);
};

document.getElementById('makePaymentButton').onclick = async () => {
  const tenant = document.getElementById('address').value;
  const paymentPlanIndex = 0; // Example payment plan index
  await makePayment(tenant, paymentPlanIndex);
};

document.getElementById('getRentalButton').onclick = async () => {
  const tenant = document.getElementById('address').value;
  await getRental(tenant);
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

async function createRental(tenant, startDate, endDate, amounts, dueDates) {
  try {
      const tx = await reputationSystem.createRental(tenant, startDate, endDate, amounts, dueDates);
      await tx.wait();
      console.log("Rental created!");
  } catch (error) {
      console.error("Failed to create rental:", error);
      alert('Failed to create rental');
  }
}

async function makePayment(tenant, paymentPlanIndex) {
  try {
      const rental = await reputationSystem.getRental(tenant);
      const amount = rental.paymentPlans[paymentPlanIndex].amount;
      const tx = await reputationSystem.makePayment(tenant, paymentPlanIndex, { value: amount });
      await tx.wait();
      console.log("Payment made!");
  } catch (error) {
      console.error("Failed to make payment:", error);
      alert('Failed to make payment');
  }
}

async function getRental(tenant) {
  try {
      const rental = await reputationSystem.getRental(tenant);
      const rentalInfoDiv = document.getElementById('rentalInfo');
      rentalInfoDiv.innerHTML = `<h2>Rental Info for ${tenant}</h2>`;
      rentalInfoDiv.innerHTML += `<p>Start Date: ${new Date(rental.startDate * 1000).toLocaleString()}</p>`;
      rentalInfoDiv.innerHTML += `<p>End Date: ${new Date(rental.endDate * 1000).toLocaleString()}</p>`;
      rental.paymentPlans.forEach((plan, index) => {
          rentalInfoDiv.innerHTML += `<p>Payment Plan ${index + 1}: Amount: ${plan.amount}, Due Date: ${new Date(plan.dueDate * 1000).toLocaleString()}, Paid: ${plan.paid}</p>`;
      });
  } catch (error) {
      console.error("Failed to get rental:", error);
      alert('Failed to get rental');
  }
}
