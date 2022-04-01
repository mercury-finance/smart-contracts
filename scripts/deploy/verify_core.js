const hre = require("hardhat");

const {
    VAT, SPOT, aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin,
    MANAGER,
    INTERACTION,
    Oracle
} = require('../../addresses.json');
const {ethers} = require("hardhat");


async function main() {
    console.log('Running deploy script');
    let collateral = ethers.utils.formatBytes32String("aBNBc");

    console.log('Validating code');
    await hre.run("verify:verify", {
        address: VAT
    });

    await hre.run("verify:verify", {
        address: USB,
        constructorArguments: [
            97
        ],
    });

    await hre.run("verify:verify", {
        address: aBNBc
    });

    await hre.run("verify:verify", {
        address: Oracle
    });

    await hre.run("verify:verify", {
        address: SPOT,
        constructorArguments: [
            VAT
        ],
    });

    await hre.run("verify:verify", {
        address: UsbJoin,
        constructorArguments: [
            VAT,
            USB,
        ],
    });
    await hre.run("verify:verify", {
        address: aBNBcJoin,
        constructorArguments: [
            VAT,
            collateral,
            aBNBc,
        ],
    });
    console.log('Finished');
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
