const hre = require("hardhat");

const main = async () => {
  try {
    const nftContractFactory = await hre.ethers.getContractFactory(
      "CharacterCollector"
    );
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();

    console.log("Contract deployed to:", nftContract.address);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
