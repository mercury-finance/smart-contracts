const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers, network } = require('hardhat');
const Web3 = require('web3');
const {ether, expectRevert, BN, expectEvent} = require('@openzeppelin/test-helpers');

///////////////////////////////////////////
//Word of Notice: Commented means pending//
//The test will be updated on daily basis//
///////////////////////////////////////////

describe('===INTERACTION===', function () {
    let deployer, signer1, signer2, mockVow;

    let vat,
        spot,
        usb,
        abnbc,
        abnbcJoin,
        usbJoin,
        jug,
        oracle;

    let interaction;

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000", // 45 Decimals
        ONE = 10 ** 27;


    let collateral = ethers.utils.formatBytes32String("aBNBc");

    before(async function () {

        ////////////////////////////////
        /** Deployments ------------ **/
        ////////////////////////////////

        [deployer, signer1, signer2, mockVow] = await ethers.getSigners();

        this.Vat = await ethers.getContractFactory("Vat");
        this.Spot = await ethers.getContractFactory("Spotter");
        this.Usb = await ethers.getContractFactory("Usb");
        this.ABNBC = await ethers.getContractFactory("aBNBc");
        this.GemJoin = await ethers.getContractFactory("GemJoin");
        this.UsbJoin = await ethers.getContractFactory("UsbJoin");
        this.Jug = await ethers.getContractFactory("Jug");
        this.Oracle = await ethers.getContractFactory("Oracle"); // Mock Oracle
        this.Interaction = await ethers.getContractFactory("DAOInteraction");

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
        abnbc = await this.ABNBC.connect(deployer).deploy();
        await abnbc.deployed(); // Collateral
        abnbcJoin = await this.GemJoin.connect(deployer).deploy(vat.address, collateral, abnbc.address);
        await abnbcJoin.deployed();

        // Rates module
        // jug = await this.Jug.connect(deployer).deploy(vat.address);
        // await jug.deployed();

        // External
        oracle = await this.Oracle.connect(deployer).deploy();
        await oracle.deployed();

        interaction = await this.Interaction.connect(deployer).deploy(
            vat.address,
            spot.address,
            abnbc.address,
            usb.address,
            abnbcJoin.address,
            usbJoin.address
        );
        await interaction.deployed();
        //////////////////////////////
        /** Initial Setup -------- **/
        //////////////////////////////

        // Initialize External
        // 2.000000000000000000000000000 ($) * 0.8 (80%) = 1.600000000000000000000000000,
        // 2.000000000000000000000000000 / 1.600000000000000000000000000 = 1.250000000000000000000000000 = mat
        await oracle.connect(deployer).setPrice("2" + wad); // 2$, mat = 80%, 2$ * 80% = 1.6$ With Safety Margin

        // Initialize Core Module
        await vat.connect(deployer).init(collateral);
        await vat.connect(deployer).rely(abnbcJoin.address);
        await vat.connect(deployer).rely(usbJoin.address);
        await vat.connect(deployer).rely(spot.address);
        await vat.connect(deployer).rely(interaction.address);
        // await vat.connect(deployer).rely(jug.address);
        await vat.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "2000" + rad); // Normalized USB
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "1200" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("spot"), "500" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("dust"), "10" + rad);

        await spot.connect(deployer)["file(bytes32,bytes32,address)"](collateral, ethers.utils.formatBytes32String("pip"), oracle.address);
        await spot.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000"); // Liquidation Ratio
        await spot.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray); // It means pegged to 1$
        await spot.connect(deployer).poke(collateral);

        // Initialize Usb Module
        await usb.connect(deployer).rely(usbJoin.address);
    });

    it('put collaterall and borrow', async function () {

        let s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal("0");

        // collateral == "aBNBc" == ilk

        //Mint some tokens for user
        await abnbc.connect(deployer).mint(signer1.address, ether("5000").toString());
        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("5000").toString());

        // Check initial state
        let free = await interaction.connect(signer1).free(signer1.address);
        expect(free.toString()).to.equal("0");
        let locked = await interaction.connect(signer1).locked(signer1.address);
        expect(locked.toString()).to.equal("0");

        // Approve and send some collateral inside. collateral value == 400 == `dink`
        let dink = ether("400").toString();

        await abnbc.connect(signer1).approve(interaction.address, dink);
        await interaction.connect(signer1).deposit(dink);

        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4600").toString());

        let s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal("0");

        free = await interaction.connect(signer1).free(signer1.address);
        expect(free.toString()).to.equal("0");
        locked = await interaction.connect(signer1).locked(signer1.address);
        expect(locked.toString()).to.equal(ether("400").toString());

        // Locking collateral and borrowing USB
        // We want to draw 60 USB == `dart`

        let dart = ether("60").toString();
        await interaction.connect(signer1).borrow(dart);

        s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal(dart);

        free = await interaction.connect(signer1).free(signer1.address);
        expect(free.toString()).to.equal("0");
        locked = await interaction.connect(signer1).locked(signer1.address);
        expect(locked.toString()).to.equal(dink);
        s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal(dart);

        // User locked 400 aBNBc with price 2 and rate 0.8 == 640$ collateral worth
        // Borrowed 60$ => available should equal to 640 - 60 = 580.
        let available = await interaction.connect(signer1).availableToBorrow(signer1.address);
        expect(available.toString()).to.equal(ether("580").toString());
    });

    it('payback and withdraw', async function() {
        let dart = ether("60").toString();

        // let vatState = await vat.connect(signer1).urns(collateral, signer1.address);
        // console.log(vatState);

        let s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4600").toString());
        let s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal(dart);

        await usb.connect(signer1).approve(interaction.address, dart);
        await interaction.connect(signer1).payback(dart);

        s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal("0");
        // let ilk = await vat.connect(signer1).ilks(collateral);
        // console.log(ilk);

        // vatState = await vat.connect(signer1).urns(collateral, signer1.address);
        // console.log(vatState);

        let available = await interaction.connect(signer1).availableToBorrow(signer1.address);
        expect(available.toString()).to.equal(ether("640").toString());

        // USB are burned, now we have to withdraw collateral
        // We will always withdraw all available collateral
        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4600").toString());

        let free = await interaction.connect(signer1).free(signer1.address);
        expect(free.toString()).to.equal("0");

        await interaction.connect(signer1).withdraw(ether("200").toString());

        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4800").toString());

    });
});