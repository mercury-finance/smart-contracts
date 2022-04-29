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

async function main() {
    console.log('Running deploy script');

    let newCollateral = ethers.utils.formatBytes32String("ceToken");
    let tokenAddress = "0xCa33FBAb46a05D7f8e3151975543a3a1f7463F63";

    this.Vat = await hre.ethers.getContractFactory("Vat");
    this.Clip = await hre.ethers.getContractFactory("Clipper");
    this.Interaction = await hre.ethers.getContractFactory("DAOInteraction");
    this.GemJoin = await hre.ethers.getContractFactory("GemJoin");

    const clip = await this.Clip.deploy(VAT, SPOT, DOG, newCollateral);
    await clip.deployed();
    console.log("Clip deployed to:", clip.address);

    const tokenJoin = await this.GemJoin.deploy(VAT, newCollateral, tokenAddress);
    await tokenJoin.deployed();
    console.log("tokenJoin deployed to:", tokenJoin.address);

    let interaction = this.Interaction.attach(INTERACTION);

    // await interaction.setCollateralType(tokenAddress, tokenJoin.address, newCollateral, clip.address);
    await interaction.enableCollateralType(tokenAddress, tokenJoin.address, newCollateral, clip.address);

    let vat = this.Vat.attach(VAT);
    await vat.rely(tokenJoin.address);
    // Clip deployed to: 0xAB5841e0325C621056f9DC85b1dB930FA073c424
    // tokenJoin deployed to: 0x64508e93118394477334a2C32e03a6EEeFeab42f
    // Finished

    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });