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
    INTERACTION, REAL_ABNBC, REWARDS,
} = require('../../addresses.json');
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

    let vat = this.Vat.attach(VAT);
    // await vat.init(collateral);
    // await vat.rely(aBNBcJoin);
    // await vat.rely(INTERACTION);

    let interaction = this.Interaction.attach(INTERACTION);
    // console.log("Set cores");
    // await interaction.setCores(
    //     VAT,
    //     SPOT,
    //     UsbJoin,
    //     JUG
    // )

    // console.log("Setting collaterals");
    await interaction.setCollateralType(aBNBc, aBNBcJoin, collateral);
    await interaction.setCollateralType(REAL_ABNBC, REALaBNBcJoin, collateral2);
    console.log("Enable collaterals");

    // console.log(collateral);
    // await interaction.enableCollateralType(aBNBc, aBNBcJoin, collateral);
    // await interaction.enableCollateralType(REAL_ABNBC, REALaBNBcJoin, collateral2);
    // console.log("Set rewards");
    // await interaction.setHelioRewards(REWARDS);
    console.log("Drip");
    await interaction.drip(aBNBc);
    await interaction.drip(REAL_ABNBC);
    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
