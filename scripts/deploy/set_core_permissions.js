const hre = require("hardhat");

const { VAT,
    SPOT,
    aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin,
    MANAGER} = require('../../addresses.json');
const {ethers} = require("hardhat");

async function main() {
    console.log('Running deploy script');

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000"; // 45 Decimals

    let collateral = ethers.utils.formatBytes32String("aBNBc");

    this.Vat = await hre.ethers.getContractFactory("Vat");
    this.Spot = await hre.ethers.getContractFactory("Spotter");
    this.Usb = await hre.ethers.getContractFactory("Usb");
    this.GemJoin = await hre.ethers.getContractFactory("GemJoin");
    this.UsbJoin = await hre.ethers.getContractFactory("UsbJoin");
    this.Manager = await hre.ethers.getContractFactory("DssCdpManager");
    this.Interaction = await hre.ethers.getContractFactory("DAOInteraction");

    console.log("Setting permissions");

    let vat = this.Vat.attach(VAT);
    await vat.init(collateral);
    await vat.rely(aBNBcJoin);
    await vat["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "5000" + rad);
    await vat["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "2000" + rad);
    await vat["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("spot"), "500" + rad);
    await vat["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("dust"), "10" + rad);

    let spot = this.Spot.attach(SPOT);
    await spot["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray);

    let usb = this.Usb.attach(USB);
    await usb.rely(UsbJoin);

    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
