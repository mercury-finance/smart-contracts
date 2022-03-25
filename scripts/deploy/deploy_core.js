const hre = require("hardhat");

const { VAT, SPOT, aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin} = require('../../addresses.json');
const {ethers} = require("hardhat");


async function main() {
    console.log('Running deploy script');

    let collateral = ethers.utils.formatBytes32String("aBNBc");

    this.Vat = await hre.ethers.getContractFactory("Vat");
    this.Spot = await hre.ethers.getContractFactory("Spotter");
    this.Usb = await hre.ethers.getContractFactory("Usb");
    this.GemJoin = await hre.ethers.getContractFactory("GemJoin");
    this.UsbJoin = await hre.ethers.getContractFactory("UsbJoin");
    this.Manager = await hre.ethers.getContractFactory("DssCdpManager");

    const vat = await this.Vat.deploy();
    await vat.deployed();
    console.log("Vat deployed to:", vat.address);

    const spot = await this.Spot.deploy(vat.address);
    await spot.deployed();
    console.log("Spot deployed to:", spot.address);

    const abnbc = await this.Usb.deploy(97);
    await abnbc.deployed();
    console.log("aBNBc deployed to:", abnbc.address);

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

    const manager = await this.Manager.deploy(vat.address);
    await manager.deployed();
    console.log("manager deployed to:", manager.address);

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
        constructorArguments: [
            97
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
        address: manager.address,
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
