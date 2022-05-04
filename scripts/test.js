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
    INTERACTION, REAL_ABNBC, REWARDS, DOG,
    CLIP1
} = require('../addresses.json');
const {ether} = require("@openzeppelin/test-helpers");
const {ethers, upgrades} = require("hardhat");

async function main() {
    console.log('Running deploy script');

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000"; // 45 Decimals

    let collateral = ethers.utils.formatBytes32String("aBNBc");
    let collateral2 = ethers.utils.formatBytes32String("aBNBc2");

    console.log(collateral);

    this.Interaction = await hre.ethers.getContractFactory("DAOInteraction");
    const interaction = await upgrades.deployProxy(this.Interaction, [
        VAT,
        SPOT,
        USB,
        UsbJoin,
        JUG,
        DOG,
        REWARDS,
    ], {
        initializer: "initialize"
    });
    this.Vat = await hre.ethers.getContractFactory("Vat");
    let vat = this.Vat.attach(VAT);
    this.ABNBC = await ethers.getContractFactory("aBNBc");
    let abnbc = this.ABNBC.attach(aBNBc);

    this.UsbFactory = await ethers.getContractFactory("Usb");
    let usb = this.UsbFactory.attach(USB);

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });
    const signer = await ethers.getSigner("0x73CF7cC1778a60d43Ca2833F419B77a76177156A")

    await vat.connect(signer).rely(interaction.address);
    await vat.connect(signer).behalf("0xb23b8d18EE1222Dc9Fc83F538419417bF0442572", interaction.address);

    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });
    await interaction.enableCollateralType(aBNBc, aBNBcJoin, collateral, CLIP1);

    // let interaction = this.Interaction.attach(INTERACTION);

    const accounts = await hre.ethers.getSigners();

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0xb23b8d18EE1222Dc9Fc83F538419417bF0442572"],
    });
    const myAcc = await ethers.getSigner("0xb23b8d18EE1222Dc9Fc83F538419417bF0442572")

    let b = await usb.balanceOf(myAcc.address);
    let a = await abnbc.balanceOf(myAcc.address);
    console.log("USB start: " + b.toString());
    console.log("ABNBC start: " + a.toString());
    await abnbc.connect(myAcc).approve(interaction.address, ether("50000").toString());
    await usb.connect(myAcc).approve(interaction.address, ether("50000").toString());
    await interaction.connect(myAcc).deposit(myAcc.address, aBNBc, ether("2").toString());
    await interaction.connect(myAcc).borrow(myAcc.address, aBNBc, ether("100").toString());
    await interaction.connect(myAcc).payback(myAcc.address, aBNBc, ether("50").toString());
    let b2 = await usb.balanceOf(myAcc.address);
    let a2 = await abnbc.balanceOf(myAcc.address);


    await interaction.connect(myAcc).drip(aBNBc);
    await interaction.connect(myAcc).borrow(myAcc.address, aBNBc, ether("100").toString());

    console.log("USB end: " + b2.toString());
    console.log("ABNBC end: " + a2.toString());

    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });
    // for (const account of accounts) {
    //     console.log(account.address);
    // }
    //
    // await abnbc.connect(accounts[0]).mintMe(ether("10000").toString());
    // await abnbc.connect(accounts[0]).approve(interaction.address, ether("10000").toString());
    //
    // await interaction.connect(accounts[0]).deposit(accounts[0].address, aBNBc, ether("10").toString());
    // await interaction.connect(accounts[0]).borrow(accounts[0].address, aBNBc, ether("100").toString());
    //
    // let usbBalance = await usb.balanceOf(accounts[0].address);
    // console.log(usbBalance.toString());
    // await usb.connect(accounts[0]).approve(interaction.address, ether("10000").toString());
    //
    // await interaction.connect(accounts[0]).payback(accounts[0].address, aBNBc, ether("60").toString());
    // await interaction.connect(accounts[0]).withdraw(accounts[0].address, aBNBc, ether("4").toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
