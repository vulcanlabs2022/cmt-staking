const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const CMTStaking = await ethers.getContractFactory('CMTStaking');
    const initializeParams = ['0x945e9704D2735b420363071bB935ACf2B9C4b814'];
    const constructorParams = [ethers.utils.parseEther('0.0001')];
    console.log("Deploying ...");
    console.log(`Initialize params: ${initializeParams}`);
    console.log(`Constructor params: ${constructorParams}`);
    const proxy = await upgrades.deployProxy(CMTStaking, initializeParams, { initializer: 'initialize', kind: 'uups', constructorArgs: constructorParams, unsafeAllow: ['state-variable-immutable'] })

    console.log("Proxy address", proxy.address)
    console.log("Waiting for deployed...")
    await proxy.deployed();

    const implAddress = await upgrades.erc1967.getImplementationAddress(proxy.address)
    console.log("Implementation address", implAddress)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
