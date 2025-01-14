# Level Up / Character Collector
Simple blockchain game where players mint a character and can level up by interacting with the smart contract. First player to 75 wins. Level ups will come in random incrememnts between 1-10. When the game is won, a new session begins, where participants have to mint new characters.

The aim of the project was to incorporate multiple blockchain and frontend technologies. There is no emphasis on game mechanics here, it is intended to be arbitrary and upgradable.

## Prerequisites
- For now, a Metamask wallet
- Arbitrum Sepolia ETH for gas fees

## Instructions
- Connect wallet via connect button on navbar.
- Add a name and click mint to mint token. Follow wallet instructions.
- To level up, click level up button on site. Confirm transaction 1, which requests random output from Chainlink VRF.
- Click confirm on second wallet transaction to finalise level up

## Contract Details
[Arbiscan Sepolia](https://sepolia.arbiscan.io/address/0x1f3cf6f99bb7f53bc860e546b3098c3b4a76bfe0)
Contract address: 0x1f3CF6f99bb7f53bC860e546B3098c3B4A76BfE0


## Technologies Used

### Blockchain
- **Solidity** - EVM Smart contract programming language used to write the contract.
- **Hardhat** - Development environment for compiling and deploying and smart contracts. Also used to verify on Arbiscan (Sepolia)
- **Chainlink VRF2** - Verifiable Random Function used to generate provably random numbers on-chain.
- **The Graph** - Subgraph indexing protocol for querying blockchain data efficiently.
- **Arbitrum Sepolia** - Layer 2 scaling solution used as the deployment network for smart contracts.
- **Reown AppKit** - Integrated wallet solution for connection to the application.

### Web Development
- **Vite** - Build tool optimized for modern web development.
- **React** - Front-end library for building user interfaces.
- **Vercel** - Deployed to Vercel.

## Work Ons
- Amend contract interactions so all wallets will work.
- Make site responsive.
- Contract interaction improvments. There seems to be some unpredictable failures in contract interactions. It is replicatable on Arbiscan so doesn't seem to be the app frontend. 

