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
    INTERACTION, REAL_ABNBC, REWARDS, DOG
} = require('../addresses.json');
const {ether} = require("@openzeppelin/test-helpers");
const {ethers} = require("hardhat");

async function main() {
    console.log('Running deploy script');

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000"; // 45 Decimals

    let collateral = ethers.utils.formatBytes32String("aBNBc");
    let collateral2 = ethers.utils.formatBytes32String("aBNBc2");

    console.log(collateral);

    this.Interaction = await hre.ethers.getContractFactory("DAOInteraction");
    let interaction = this.Interaction.attach(INTERACTION);

    const accounts = await hre.ethers.getSigners();

    // for (const account of accounts) {
    //     console.log(account.address);
    // }
    this.Usb = await ethers.getContractFactory("aBNBc");
    let abnbc = this.Usb.attach(aBNBc);
    await abnbc.connect(accounts[0]).mintMe(ether("10000").toString());
    await abnbc.connect(accounts[0]).approve(INTERACTION, ether("10000").toString());

    await interaction.connect(accounts[0]).deposit(accounts[0].address, aBNBc, ether("10").toString());
    await interaction.connect(accounts[0]).borrow(accounts[0].address, aBNBc, ether("100").toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
