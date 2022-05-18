const hre = require("hardhat");

const { VAT,
    SPOT,
    USB,
    UsbJoin,
    JUG,
    INTERACTION, REWARDS, DOG,
    CLIP3, COLLATERAL_CE_ABNBC, ceBNBc, ceBNBcJoin, HELIO_TOKEN
} = require('../addresses-stage.json');
const {ether} = require("@openzeppelin/test-helpers");
const {ethers, upgrades} = require("hardhat");

async function main() {

    let newCollateral = ethers.utils.formatBytes32String(COLLATERAL_CE_ABNBC);
    console.log("CeToken ilk: " + newCollateral);

    this.VAT = await hre.ethers.getContractFactory("Vat");
    this.HelioRewards = await hre.ethers.getContractFactory("HelioRewards");
    this.HelioToken = await hre.ethers.getContractFactory("HelioToken");
    this.Interaction = await hre.ethers.getContractFactory("Interaction");

    let helioToken = this.HelioToken.attach(HELIO_TOKEN);

    const rewards = await this.HelioRewards.deploy(VAT);
    await rewards.deployed();

    await rewards.setHelioToken(helioToken.address);
    await rewards.initPool(ceBNBc, newCollateral, "1000000001847694957439350500"); //6%

    const interactionNew = await upgrades.deployProxy(this.Interaction, [
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

    await interactionNew.setRewards(rewards.address);

    let vat = this.VAT.attach(VAT);
    this.UsbFactory = await ethers.getContractFactory("Usb");
    let usb = this.UsbFactory.attach(USB);

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });
    const signerDeployer = await ethers.getSigner("0x73CF7cC1778a60d43Ca2833F419B77a76177156A")

    await vat.connect(signerDeployer).rely(interactionNew.address);
    await vat.connect(signerDeployer).behalf("0x37a7d129df800a4c75d13b2d94e1afc024a54fed", interactionNew.address);
    await vat.connect(signerDeployer).behalf("0x73CF7cC1778a60d43Ca2833F419B77a76177156A", interactionNew.address);

    await helioToken.connect(signerDeployer).rely(rewards.address);

    // await hre.network.provider.request({
    //     method: "hardhat_stopImpersonatingAccount",
    //     params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    // });

    // await interactionNew.setRewards(rewards.address);
    await interactionNew.enableCollateralType(ceBNBc, ceBNBcJoin, newCollateral, CLIP3);

    // await hre.network.provider.request({
    //     method: "hardhat_impersonateAccount",
    //     params: ["0x37a7d129df800a4c75d13b2d94e1afc024a54fed"],
    // });
    // const signer = await ethers.getSigner("0x37a7d129df800a4c75d13b2d94e1afc024a54fed")

    let interaction = this.Interaction.attach(INTERACTION);
    await interaction.connect(signerDeployer).borrow(
        ceBNBc,
        "200000000000000000000")

    let usbBalance = await vat.usb("0x73CF7cC1778a60d43Ca2833F419B77a76177156A");
    console.log(usbBalance);

    await usb.connect(signerDeployer).approve(interaction.address, "5000000000000000000");
    await interaction.connect(signerDeployer).payback(
        "0x24308Ca3B62129D51ecfA99410d6B59e0E6c7bfD",
        "5000000000000000000")

    // await interaction.connect(signerDeployer).withdraw(
    //     "0x24308Ca3B62129D51ecfA99410d6B59e0E6c7bfD",
    //     "0x24308Ca3B62129D51ecfA99410d6B59e0E6c7bfD",
    //     "5000000000000000000")
    // await interaction.connect(signer).payback("0x37a7d129df800a4c75d13b2d94e1afc024a54fed",
    //     "0x24308Ca3B62129D51ecfA99410d6B59e0E6c7bfD",
    //     "5000000000000000000")
    //
    // await hre.network.provider.request({
    //     method: "hardhat_stopImpersonatingAccount",
    //     params: ["0x37a7d129df800a4c75d13b2d94e1afc024a54fed"],
    // });

    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
