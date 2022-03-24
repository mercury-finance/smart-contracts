const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');
const Web3 = require('web3');

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const DATA = "0x02";

///////////////////////////////////////////
//Word of Notice: Commented means pending//
//The test will be updated on daily basis//
///////////////////////////////////////////

describe('===MVP1===', function () {
    let deployer, signer1, signer2, signer3;

    let vat, 
        spot, 
        usb, 
        abnbc, 
        gemJoin, 
        usbJoin,
        jug;

    let oracle;

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000"; // 45 Decimals

    let collateral = ethers.utils.formatBytes32String("aBNBc");

    before(async function () {

        ////////////////////////////////
        /** Deployments ------------ **/
        ////////////////////////////////

        [deployer, signer1, signer2, signer3] = await ethers.getSigners();

        this.Vat = await ethers.getContractFactory("Vat");
        this.Spot = await ethers.getContractFactory("Spotter");
        this.Usb = await ethers.getContractFactory("Usb");
        this.GemJoin = await ethers.getContractFactory("GemJoin");
        this.UsbJoin = await ethers.getContractFactory("UsbJoin");
        this.Jug = await ethers.getContractFactory("Jug");
        this.Oracle = await ethers.getContractFactory("Oracle"); // Mock Oracle

        // Core module
        vat = await this.Vat.connect(deployer).deploy();
        await vat.deployed();
        spot = await this.Spot.connect(deployer).deploy(vat.address);
        await spot.deployed();

        // Usb module
        usb = await this.Usb.connect(deployer).deploy(97);
        await usb.deployed(); // Stable Coin
        usbJoin = await this.UsbJoin.connect(deployer).deploy(vat.address, usb.address);
        await usbJoin.deployed();

        // Collateral module
        abnbc = await this.Usb.connect(deployer).deploy(97);
        await abnbc.deployed(); // Collateral
        gemJoin = await this.GemJoin.connect(deployer).deploy(vat.address, collateral, abnbc.address);
        await gemJoin.deployed();
        
        // Rates module
        jug = await this.Jug.connect(deployer).deploy(vat.address);
        await jug.deployed();

        // External
        oracle = await this.Oracle.connect(deployer).deploy();
        await oracle.deployed();

        //////////////////////////////
        /** Initial Setup -------- **/
        //////////////////////////////

        // Initialize External
        // 2.000000000000000000000000000 ($) * 0.8 (80%) = 1.600000000000000000000000000, 
        // 2.000000000000000000000000000 / 1.600000000000000000000000000 = 1.250000000000000000000000000 = mat
        await oracle.connect(deployer).setPrice("2" + wad); // 2$, mat = 80%, 2$ * 80% = 1.6$ With Safety Margin

        // Initialize Core Module 
        await vat.connect(deployer).init(collateral);
        await vat.connect(deployer).rely(gemJoin.address);
        await vat.connect(deployer).rely(usbJoin.address);
        await vat.connect(deployer).rely(spot.address);
        await vat.connect(deployer).rely(jug.address);
        await vat.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "5000" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "2000" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("dust"), "500" + rad);

        await spot.connect(deployer)["file(bytes32,bytes32,address)"](collateral, ethers.utils.formatBytes32String("pip"), oracle.address);
        await spot.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000"); // Liquidation Ratio
        await spot.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray); // It means pegged to 1$
        await spot.connect(deployer).poke(collateral);

        // Initialize Usb Module
        await usb.connect(deployer).rely(usbJoin.address);

        // Initialize Collateral Module [User should approve gemJoin while joining]

        // Initialize Rates Module
        // ==> principal*(rate**seconds)-principal = 0.01 (We want 1% Yearly "base" interest)
        // ==> 1 * (R ** 31536000 seconds) - 1 = 0.01
        // ==> 1*(R**31536000) = 1.01
        // ==> R**31536000 = 1.01
        // ==> R = 1.01**(1/31536000)
        // ==> R = 1.000000000315529215730000000 [ray]
        await jug.connect(deployer).init(collateral); // Duty on next line already set here, which is 0% yearly. 
        // await jug.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("duty"), "1" + ray); // 0% Yearly. It needs rho == now
        await jug.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("base"), "1000000000315529215730000000"); // 1% Yearly
        // await jug.connect(deployer)["file(bytes32,address)"](ethers.utils.formatBytes32String("vow"), NULL_ADDRESS);
    });

    it('should check collateralization and borrowing Usb', async function () {

        // Signer1 and Signer2 have some aBNBc
        await abnbc.connect(deployer).mint(signer1.address, ethers.utils.parseEther("5000"));
        await abnbc.connect(deployer).mint(signer2.address, ethers.utils.parseEther("5000"));

        // Signer1 and Signer2 entered the system with 400 and 900 respectively (Unlocked)
        await abnbc.connect(signer1).approve(gemJoin.address, ethers.utils.parseEther("400"));
        await gemJoin.connect(signer1).join(signer1.address, ethers.utils.parseEther("400"));
        await abnbc.connect(signer2).approve(gemJoin.address, ethers.utils.parseEther("900"));
        await gemJoin.connect(signer2).join(signer2.address, ethers.utils.parseEther("900"));

        expect((await vat.connect(deployer).gem(collateral, signer1.address)).toString()).to.be.equal(await (ethers.utils.parseEther("400")).toString());
        expect((await vat.connect(deployer).gem(collateral, signer2.address)).toString()).to.be.equal(await (ethers.utils.parseEther("900")).toString());
        
        // Signer1 and Signer2 collateralize 400 and 900 respectively
        await vat.connect(signer1).frob(collateral, signer1.address, signer1.address, signer1.address, ethers.utils.parseEther("400"), 0); // 400 * 1.6$ = 640$ worth locked
        expect((await vat.connect(deployer).gem(collateral, signer1.address)).toString()).to.be.equal(await (ethers.utils.parseEther("0")).toString());
        expect((await (await vat.connect(deployer).urns(collateral, signer1.address)).ink).toString()).to.be.equal(await (ethers.utils.parseEther("400")).toString());

        await vat.connect(signer2).frob(collateral, signer2.address, signer2.address, signer2.address, ethers.utils.parseEther("900"), 0); // 900 * 1.6$ = 1440$ worth locked
        expect((await vat.connect(deployer).gem(collateral, signer2.address)).toString()).to.be.equal(await (ethers.utils.parseEther("0")).toString());
        expect((await (await vat.connect(deployer).urns(collateral, signer2.address)).ink).toString()).to.be.equal(await (ethers.utils.parseEther("900")).toString());
        
        // Signer1 and Signer2 borrow Usb respectively [Note: Can be done in a single frob]
        // Note borrows should be less than "Line/line" and greater than "dust"
        // Note "dart" in the frob is normalized. dart / ilk.rate = normalized
        expect((await vat.connect(signer1).usb(signer1.address)).toString()).to.be.equal("0");
        expect((await vat.connect(signer1).debt()).toString()).to.be.equal("0");
        expect((await (await vat.connect(signer1).urns(collateral, signer1.address)).art).toString()).to.be.equal("0");
        expect((await (await vat.connect(signer1).ilks(collateral)).Art).toString()).to.be.equal("0");
                
        // await jug.connect(deployer).drip(collateral);
        let debt_rate = await (await vat.ilks(collateral)).rate;
        console.log(debt_rate)
        await vat.connect(signer1).frob(collateral, signer1.address, signer1.address, signer1.address, 0, ethers.utils.parseEther("600")); // 600 USBs
        await vat.connect(signer2).frob(collateral, signer2.address, signer2.address, signer2.address, 0, ethers.utils.parseEther("900")); // 900 USBs

        expect((await vat.connect(signer1).usb(signer1.address)).toString()).to.be.equal("600" + rad);
        expect((await vat.connect(signer1).debt()).toString()).to.be.equal("1500" + rad); // 1500 because signer2 added too
        expect((await (await vat.connect(signer1).urns(collateral, signer1.address)).art).toString()).to.be.equal("600" + wad);
        expect((await (await vat.connect(signer1).ilks(collateral)).Art).toString()).to.be.equal("1500" + wad); // 1500 because signer2 added too

        // // Update Stability Fees
        // await jug.connect(deployer).drip(collateral);
        // // await network.provider.send("evm_increaseTime", [60])
        // // await jug.connect(deployer).drip(collateral);

        // let rate = await (await vat.ilks(collateral)).rate;
        // let urnArt = await (await vat.urns(collateral, signer1.address)).art;
        // console.log(rate + "~" + urnArt)

    });
});
