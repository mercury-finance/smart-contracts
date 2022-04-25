const hre = require("hardhat");

const { VAT,
    SPOT,
    aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin,
    Oracle,
    JUG,
    REAL_ABNBC,
    REALaBNBcJoin,
    REWARDS,
    HELIO_TOKEN, INTERACTION
} = require('../../addresses.json');
const {ethers} = require("hardhat");

async function main() {
    console.log('Running deploy script');

    this.HelioToken = await hre.ethers.getContractFactory("HelioToken");
    this.HelioRewards = await hre.ethers.getContractFactory("HelioRewards");

    const rewards = await this.HelioRewards.deploy();
    await rewards. deployed();
    console.log("Rewards deployed to:", rewards.address);

    const helioToken = await this.HelioToken.deploy(rewards.address);
    await helioToken.deployed();
    console.log("helioToken deployed to:", helioToken.address);

    console.log('Validating code');

    await hre.run("verify:verify", {
        address: rewards.address,
    });
    await hre.run("verify:verify", {
        address: helioToken.address,
        constructorArguments: [
            rewards.address
        ],
    });

    console.log('Adding rewards pool');
    // rewards = this.HelioRewards.attach(REWARDS);
    let collateral = ethers.utils.formatBytes32String("aBNBc");
    await rewards.initPool(collateral);
    await rewards.setHelioToken(helioToken.address);

    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
