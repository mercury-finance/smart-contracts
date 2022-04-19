const hre = require("hardhat");

const { VAT,
    SPOT,
    aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin,
    REALaBNBcJoin,
    REALOracle,
    JUG,
    Oracle,
    VOW,
    INTERACTION} = require('../../addresses.json');
const {ethers} = require("hardhat");

async function main() {
    console.log('Running deploy script');

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000"; // 45 Decimals

    let collateral = ethers.utils.formatBytes32String("aBNBc");
    let collateral2 = ethers.utils.formatBytes32String("aBNBc2");

    this.Vat = await hre.ethers.getContractFactory("Vat");
    this.Spot = await hre.ethers.getContractFactory("Spotter");
    this.Usb = await hre.ethers.getContractFactory("Usb");
    this.GemJoin = await hre.ethers.getContractFactory("GemJoin");
    this.UsbJoin = await hre.ethers.getContractFactory("UsbJoin");
    this.Oracle = await hre.ethers.getContractFactory("Oracle");
    this.Jug = await hre.ethers.getContractFactory("Jug");
    this.Interaction = await hre.ethers.getContractFactory("DAOInteraction");


    console.log("Setting permissions");

    // let oracle = this.Oracle.attach(Oracle);
    // await oracle.setPrice("400" + wad); // 400$, mat = 80%, 400$ * 80% = 320$ With Safety Margin

    // console.log("Vat...");

    // let vat = this.Vat.attach(VAT);
    // await vat.init(collateral);
    // await vat.rely(aBNBcJoin);
    // await vat.rely(INTERACTION);
    // await vat.rely(SPOT);
    // await vat["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "150000" + rad);
    // await vat["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "50000" + rad);
    // await vat["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("spot"), "500" + rad);
    // await vat["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("dust"), "1" + rad);

    console.log("Spot...");
    let spot = this.Spot.attach(SPOT);
    await spot["file(bytes32,bytes32,address)"](collateral2, ethers.utils.formatBytes32String("pip"), REALOracle);
    // await spot["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000"); // Liquidation Ratio
    // await spot["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray); // It means pegged to 1$
    await spot.poke(collateral2);

    let jug = this.Jug.attach(JUG);
    await jug["file(bytes32,address)"](ethers.utils.formatBytes32String("vow"), VOW);

    // console.log("Usb...");
    // let usb = this.Usb.attach(USB);
    // await usb.rely(UsbJoin);

    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
