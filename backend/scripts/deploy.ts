import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const factory = await ethers.deployContract("CrowdfundingFactory");

    await factory.waitForDeployment();

    console.log("CrowdfundingFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
