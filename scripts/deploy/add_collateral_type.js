const hre = require("hardhat");

const { VAT,
    SPOT,
    aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin,
    Oracle,
    JUG,
    DOG,
    REAL_ABNBC,
    REALaBNBcJoin,
    INTERACTION} = require('../../addresses.json');
const {ethers} = require("hardhat");

let wad = "000000000000000000", // 18 Decimals
    ray = "000000000000000000000000000", // 27 Decimals
    rad = "000000000000000000000000000000000000000000000"; // 45 Decimals

async function main() {
    console.log('Running deploy script');

    let newCollateral = ethers.utils.formatBytes32String("ceToken");
    console.log("CeToken ilk: " + newCollateral);

    let tokenAddress = "0x51b9eFaB9C8D1ba25C76d3636b3E5784abD65dfC";
    // let tokenAddress = "0xCa33FBAb46a05D7f8e3151975543a3a1f7463F63";

    this.Vat = await hre.ethers.getContractFactory("Vat");
    this.Clip = await hre.ethers.getContractFactory("Clipper");
    this.Interaction = await hre.ethers.getContractFactory("DAOInteraction");
    this.GemJoin = await hre.ethers.getContractFactory("GemJoin");
    this.Spot = await hre.ethers.getContractFactory("Spotter");
    //
    // const clip = await this.Clip.deploy(VAT, SPOT, DOG, newCollateral);
    // await clip.deployed();
    // console.log("Clip deployed to:", clip.address);
    //
    // const tokenJoin = await this.GemJoin.deploy(VAT, newCollateral, tokenAddress);
    // await tokenJoin.deployed();
    // console.log("tokenJoin deployed to:", tokenJoin.address);

    // let interaction = this.Interaction.attach(INTERACTION);

    // await interaction.setCollateralType(tokenAddress, tokenJoin.address, newCollateral, clip.address);
    // await interaction.enableCollateralType(tokenAddress, tokenJoin.address, newCollateral, clip.address);

    let vat = this.Vat.attach(VAT);


    await vat.rely("0x240A27C5de2bd724bbD0ACB506c2EDF7c491ed96");
    // await vat.rely(tokenJoin.address);
    await vat["file(bytes32,bytes32,uint256)"](newCollateral, ethers.utils.formatBytes32String("line"), "50000000" + rad);
    await vat["file(bytes32,bytes32,uint256)"](newCollateral, ethers.utils.formatBytes32String("dust"), "100000000000000000" + ray);

    let spot = this.Spot.attach(SPOT);
    await spot["file(bytes32,bytes32,address)"](newCollateral, ethers.utils.formatBytes32String("pip"), Oracle);
    await spot["file(bytes32,bytes32,uint256)"](newCollateral, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000"); // Liquidation Ratio
    await spot.poke(newCollateral);

    // Clip deployed to: 0x830813216Fcd48f0Fe31a8e7Cc5306c272474ee6
    // tokenJoin deployed to: 0x1E81E9F6f8a0b499104721664f87F36c11eDaB98


    // Clip deployed to: 0xa2f1Fd3f2d84C4cee7F503c4e8a471990343e28d
    // tokenJoin deployed to: 0x240A27C5de2bd724bbD0ACB506c2EDF7c491ed96

    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
