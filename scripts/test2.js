const hre = require("hardhat");

const { VAT,
    SPOT,
    USB,
    UsbJoin,
    JUG,
    INTERACTION, REWARDS, DOG,
    CLIP3, COLLATERAL_CE_ABNBC, ceBNBc, ceBNBcJoin, HELIO_TOKEN
} = require('../addresses-stage.json');
const {ether} = require("@openzeppelin/test-helpers");
const {ethers, upgrades} = require("hardhat");

async function main() {

    let newCollateral = ethers.utils.formatBytes32String(COLLATERAL_CE_ABNBC);
    console.log("CeToken ilk: " + newCollateral);

    this.VAT = await hre.ethers.getContractFactory("Vat");
    this.HelioRewards = await hre.ethers.getContractFactory("HelioRewards");
    this.HelioToken = await hre.ethers.getContractFactory("HelioToken");
    this.Interaction = await hre.ethers.getContractFactory("Interaction");

    let helioToken = this.HelioToken.attach(HELIO_TOKEN);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
