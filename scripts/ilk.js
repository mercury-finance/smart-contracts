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
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
