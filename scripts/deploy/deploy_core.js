const hre = require("hardhat");

const { VAT, SPOT, aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin,
    REAL_ABNBC} = require('../../addresses.json');
const {ethers} = require("hardhat");


async function main() {
    console.log('Running deploy script');

    let collateral = ethers.utils.formatBytes32String("aBNBc");
    let collateral2 = ethers.utils.formatBytes32String("REALaBNBc");

    this.Vat = await hre.ethers.getContractFactory("Vat");
    this.Spot = await hre.ethers.getContractFactory("Spotter");
    this.Usb = await hre.ethers.getContractFactory("Usb");
    this.ABNBC = await hre.ethers.getContractFactory("aBNBc");
    this.GemJoin = await hre.ethers.getContractFactory("GemJoin");
    this.UsbJoin = await hre.ethers.getContractFactory("UsbJoin");
    this.Oracle = await hre.ethers.getContractFactory("Oracle"); // Mock Oracle
    this.Jug = await hre.ethers.getContractFactory("Jug");

    const vat = await this.Vat.deploy();
    await vat.deployed();
    console.log("Vat deployed to:", vat.address);

    const spot = await this.Spot.deploy(vat.address);
    await spot.deployed();
    console.log("Spot deployed to:", spot.address);

    const abnbc = await this.ABNBC.deploy();
    await abnbc.deployed();
    console.log("aBNBc deployed to:", abnbc.address);

    // const abnbc2 = await this.ABNBC.deploy("Native aBNBc", "FAKEaBNBc");
    // await abnbc2.deployed();
    // console.log("aBNBc2 deployed to:", abnbc2.address);

    const usb = await this.Usb.deploy(97);
    await usb.deployed();
    console.log("Usb deployed to:", usb.address);

    const usbJoin = await this.UsbJoin.deploy(vat.address, usb.address);
    await usbJoin.deployed();
    console.log("usbJoin deployed to:", usbJoin.address);
    //
    const abnbcJoin = await this.GemJoin.deploy(vat.address, collateral, abnbc.address);
    await abnbcJoin.deployed();
    console.log("abnbcJoin deployed to:", abnbcJoin.address);

    const abnbcJoin2 = await this.GemJoin.deploy(vat.address, collateral2, REAL_ABNBC);
    await abnbcJoin2.deployed();
    console.log("abnbcJoin2 deployed to:", abnbcJoin2.address);

    const oracle = await this.Oracle.deploy();
    await oracle.deployed();
    console.log("Oracle deployed to:", oracle.address);
    const oracle2 = await this.Oracle.deploy();
    await oracle2.deployed();
    console.log("Oracle2 deployed to:", oracle2.address);

    jug = await this.Jug.deploy(vat.address);
    await jug.deployed();
    console.log("Jug deployed to:", jug.address);

    console.log('Validating code');
    await hre.run("verify:verify", {
        address: vat.address
    });

    await hre.run("verify:verify", {
        address: usb.address,
        constructorArguments: [
            97
        ],
    });

    await hre.run("verify:verify", {
        address: abnbc.address,
    });

    await hre.run("verify:verify", {
        address: oracle.address,
    });
    await hre.run("verify:verify", {
        address: oracle2.address,
    });

    await hre.run("verify:verify", {
        address: spot.address,
        constructorArguments: [
            vat.address
        ],
    });

    await hre.run("verify:verify", {
        address: usbJoin.address,
        constructorArguments: [
            vat.address,
            usb.address
        ],
    });
    await hre.run("verify:verify", {
        address: abnbcJoin.address,
        constructorArguments: [
            vat.address,
            collateral,
            abnbc.address
        ],
    });
    await hre.run("verify:verify", {
        address: abnbcJoin2.address,
        constructorArguments: [
            vat.address,
            collateral2,
            REAL_ABNBC
        ],
    });

    await hre.run("verify:verify", {
        address: jug.address,
        constructorArguments: [
            vat.address
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
