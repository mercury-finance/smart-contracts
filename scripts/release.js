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

    this.HelioProvider = await hre.ethers.getContractFactory("HelioProvider");

    let helioToken = this.HelioToken.attach(HELIO_TOKEN);
    let helioProvider = this.HelioProvider.attach("0xb95678badcb84e0e7d93f3945517ab25f4007e77");

    // const rewards = await this.HelioRewards.deploy(VAT);
    // await rewards.deployed();

    // await rewards.setHelioToken(helioToken.address);
    // await rewards.initPool(ceBNBc, newCollateral, "1000000001847694957439350500"); //6%
    //
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

    // // await interactionNew.setRewards(rewards.address);
    // await interactionNew.setRewards(REWARDS);
    //
    let vat = this.VAT.attach(VAT);
    this.UsbFactory = await ethers.getContractFactory("Usb");
    let usb = this.UsbFactory.attach(USB);
    //
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });
    const signerDeployer = await ethers.getSigner("0x73CF7cC1778a60d43Ca2833F419B77a76177156A")

    await vat.connect(signerDeployer).rely(interactionNew.address);
    await vat.connect(signerDeployer).behalf("0x37a7d129df800a4c75d13b2d94e1afc024a54fed", interactionNew.address);
    await vat.connect(signerDeployer).behalf("0x73CF7cC1778a60d43Ca2833F419B77a76177156A", interactionNew.address);

    // await helioToken.connect(signerDeployer).rely(rewards.address);

    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: ["0x73CF7cC1778a60d43Ca2833F419B77a76177156A"],
    });

    await interactionNew.enableCollateralType(ceBNBc, ceBNBcJoin, newCollateral, CLIP3);
    let usbBalance1 = await vat.usb("0x73CF7cC1778a60d43Ca2833F419B77a76177156A");
    console.log("1: " + usbBalance1);
    let DANIIL = "0xdd868980ef73edcbc1ff758f6e53023be18e2a52";
    let urn = await vat.urns(newCollateral, DANIIL);
    console.log("URN: " + urn);

    // let interaction = this.Interaction.attach(INTERACTION);

    await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DANIIL],
        });
    const signer = await ethers.getSigner(DANIIL);

    await helioProvider.connect(signer).changeDao(interactionNew.address);
    // await helioProvider.connect(signer).release("0xdD868980eF73eDCbC1fF758F6e53023bE18e2A52", "1200000000000000000");
    await helioProvider.connect(signer).provide({ value: ethers.utils.parseEther("1.1") })

    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [DANIIL],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
