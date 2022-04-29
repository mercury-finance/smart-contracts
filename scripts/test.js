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

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });
    const signer = await ethers.getSigner("0x73CF7cC1778a60d43Ca2833F419B77a76177156A")

    await vat.connect(signer).rely(interaction.address);

    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });
    await interaction.enableCollateralType(aBNBc, aBNBcJoin, collateral, CLIP1);

    // let interaction = this.Interaction.attach(INTERACTION);

    const accounts = await hre.ethers.getSigners();

    // for (const account of accounts) {
    //     console.log(account.address);
    // }
    this.Usb = await ethers.getContractFactory("aBNBc");
    let abnbc = this.Usb.attach(aBNBc);
    await abnbc.connect(accounts[0]).mintMe(ether("10000").toString());
    await abnbc.connect(accounts[0]).approve(interaction.address, ether("10000").toString());

    await interaction.connect(accounts[0]).deposit(accounts[0].address, aBNBc, ether("10").toString());
    await interaction.connect(accounts[0]).borrow(accounts[0].address, aBNBc, ether("100").toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
