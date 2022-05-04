const hre = require("hardhat");

const {
    REAL_ABNBC, VAT, REWARDS, HELIO_TOKEN
} = require('../../addresses.json');
const {ethers} = require("hardhat");


async function main() {
    console.log('Running deploy script');

    let collateral = ethers.utils.formatBytes32String("aBNBc");
    let collateral2 = ethers.utils.formatBytes32String("REALaBNBc");
    let collateral3 = ethers.utils.formatBytes32String("BNB");

    this.Vat = await hre.ethers.getContractFactory("Vat");
    this.Spot = await hre.ethers.getContractFactory("Spotter");
    this.Usb = await hre.ethers.getContractFactory("Usb");
    this.ABNBC = await hre.ethers.getContractFactory("aBNBc");
    this.GemJoin = await hre.ethers.getContractFactory("GemJoin");
    this.UsbJoin = await hre.ethers.getContractFactory("UsbJoin");
    // this.Oracle = await hre.ethers.getContractFactory("Oracle"); // Mock Oracle
    this.Jug = await hre.ethers.getContractFactory("Jug");
    this.Flop = await hre.ethers.getContractFactory("Flopper");
    this.Flap = await hre.ethers.getContractFactory("Flapper");
    this.Vow = await hre.ethers.getContractFactory("Vow");
    this.Jar = await hre.ethers.getContractFactory("Jar");
    this.Dog = await hre.ethers.getContractFactory("Dog");
    this.Clip = await hre.ethers.getContractFactory("Clipper");
    this.HelioToken = await hre.ethers.getContractFactory("HelioToken");
    this.HelioRewards = await hre.ethers.getContractFactory("HelioRewards");

    const vat = await this.Vat.deploy();
    await vat.deployed();
    console.log("Vat deployed to:", vat.address);

    const spot = await this.Spot.deploy(vat.address);
    await spot.deployed();
    console.log("Spot deployed to:", spot.address);

    const abnbc = await this.ABNBC.deploy();
    await abnbc.deployed();
    console.log("aBNBc deployed to:", abnbc.address);

    const usb = await this.Usb.deploy(97);
    await usb.deployed();
    console.log("Usb deployed to:", usb.address);

    const usbJoin = await this.UsbJoin.deploy(vat.address, usb.address);
    await usbJoin.deployed();
    console.log("usbJoin deployed to:", usbJoin.address);
    //
    const abnbcJoin = await this.GemJoin.deploy(vat.address, collateral, abnbc.address);
    await abnbcJoin.deployed();
    console.log("abnbcJoin deployed to:", abnbcJoin.address);

    // const bnbJoin = await this.GemJoin.deploy(VAT, collateral3, "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
    // await bnbJoin.deployed();
    // console.log("bnbJoin deployed to:", bnbJoin.address);

    const abnbcJoin2 = await this.GemJoin.deploy(vat.address, collateral2, REAL_ABNBC);
    await abnbcJoin2.deployed();
    console.log("abnbcJoin2 deployed to:", abnbcJoin2.address);
    //
    // const oracle = await this.Oracle.deploy();
    // await oracle.deployed();
    // console.log("Oracle deployed to:", oracle.address);
    // const oracle2 = await this.Oracle.deploy();
    // await oracle2.deployed();
    // console.log("Oracle2 deployed to:", oracle2.address);

    jug = await this.Jug.deploy(vat.address);
    await jug.deployed();
    console.log("Jug deployed to:", jug.address);

    const flop = await this.Flop.deploy(vat.address, usbJoin.address);
    await flop.deployed();
    console.log("Flop deployed to:", flop.address);

    const flap = await this.Flap.deploy(vat.address, usbJoin.address);
    await flap.deployed();
    console.log("Flap deployed to:", flap.address);

    const vow = await this.Vow.deploy(vat.address, flap.address, flop.address);
    await vow.deployed();
    console.log("Vow deployed to:", vow.address);

    const dog = await this.Dog.deploy(vat.address);
    await dog.deployed();
    console.log("Dog deployed to:", dog.address);

    const jar = await this.Jar.deploy("Helio Earn", "EARN", vat.address, vow.address, usbJoin.address);
    await jar.deployed();
    console.log("Jar deployed to:", jar.address);

    const clip1 = await this.Clip.deploy(vat.address, spot.address, dog.address, collateral);
    await clip1.deployed();
    console.log("Clip1 deployed to:", clip1.address);
    const clip2 = await this.Clip.deploy(vat.address, spot.address, dog.address, collateral2);
    await clip2.deployed();
    console.log("Clip2 deployed to:", clip2.address);

    const helioToken = await this.HelioToken.deploy();
    await helioToken.deployed();
    console.log("helioToken deployed to:", helioToken.address);

    const rewards = await this.HelioRewards.deploy(VAT);
    await rewards.deployed();
    console.log("Rewards deployed to:", rewards.address);

    console.log('Adding rewards pool');
    await helioToken.rely(rewards.address);
    await rewards.setHelioToken(helioToken.address);
    await rewards.initPool(collateral, "1000000001847694957439350500"); //6%


    console.log('Validating code');
    await hre.run("verify:verify", {
        address: vat.address
    });

    await hre.run("verify:verify", {
        address: usb.address,
        constructorArguments: [
            97
        ],
    });

    await hre.run("verify:verify", {
        address: abnbc.address,
    });

    // await hre.run("verify:verify", {
    //     address: oracle.address,
    // });
    // await hre.run("verify:verify", {
    //     address: oracle2.address,
    // });

    await hre.run("verify:verify", {
        address: spot.address,
        constructorArguments: [
            vat.address
        ],
    });

    await hre.run("verify:verify", {
        address: usbJoin.address,
        constructorArguments: [
            vat.address,
            usb.address
        ],
    });
    await hre.run("verify:verify", {
        address: abnbcJoin.address,
        constructorArguments: [
            vat.address,
            collateral,
            abnbc.address
        ],
    });
    await hre.run("verify:verify", {
        address: abnbcJoin2.address,
        constructorArguments: [
            vat.address,
            collateral2,
            REAL_ABNBC
        ],
    });
    // await hre.run("verify:verify", {
    //     address: bnbJoin.address,
    //     constructorArguments: [
    //         vat.address,
    //         collateral3,
    //         "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    //     ],
    // });

    await hre.run("verify:verify", {
        address: jug.address,
        constructorArguments: [
            vat.address
        ],
    });
    await hre.run("verify:verify", {
        address: flop.address,
        constructorArguments: [
            vat.address,
            usbJoin.address
        ],
    });
    await hre.run("verify:verify", {
        address: flap.address,
        constructorArguments: [
            vat.address,
            usbJoin.address
        ],
    });
    await hre.run("verify:verify", {
        address: vow.address,
        constructorArguments: [
            vat.address,
            flap.address,
            flop.address
        ],
    });
    await hre.run("verify:verify", {
        address: jar.address,
        constructorArguments: [
            "Helio Earn",
            "EARN",
            vat.address,
            vow.address,
            usbJoin.address
        ],
    });

    await hre.run("verify:verify", {
        address: rewards.address,
        constructorArguments: [
            vat.address
        ],
    });
    await hre.run("verify:verify", {
        address: helioToken.address,
    });

    console.log('Finished');
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
