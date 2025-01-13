require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.1",
  networks: {
    'arbitrumSepolia': {
      url: 'https://sepolia-rollup.arbitrum.io/rpc',
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000,
    },
  },
  
  etherscan: {
    apiKey: process.env.ARBITRUM_SEPOLIA_TESTNET_API_KEY,

    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org/"
        }
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      }
    ]
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  }
};
console.log("Base Testnet API Key:", process.env.BASE_TESTNET_API_KEY);
