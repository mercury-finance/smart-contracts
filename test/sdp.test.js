const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');
const Web3 = require('web3');
const {ether, expectRevert, BN, expectEvent} = require('@openzeppelin/test-helpers');

///////////////////////////////////////////
//Word of Notice: Commented means pending//
///////////////////////////////////////////

describe('===CDP===', function () {
    let deployer, signer1, signer2, signer3;

    let vat,
        spot,
        usb,
        abnbc,
        gemJoin,
        usbJoin,
        jug,
        manager;

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
        this.Manager = await ethers.getContractFactory("DssCdpManager");

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

        manager = await this.Manager.connect(deployer).deploy(vat.address);
        await manager.deployed();
        //////////////////////////////
        /** Initial Setup -------- **/
        //////////////////////////////

        // Initialize External
        await oracle.connect(deployer).setPrice(ethers.utils.formatBytes32String("3"));

        // Initialize Core Module
        await vat.connect(deployer).init(collateral);
        await vat.connect(deployer).rely(gemJoin.address);
        await vat.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "5000" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "2000" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("spot"), "500" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("dust"), "10" + rad);

        await spot.connect(deployer)["file(bytes32,bytes32,address)"](collateral, ethers.utils.formatBytes32String("pip"), oracle.address);
        // await spot.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("mat"), "1" + ray);
        await spot.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray); // It means pegged to 1$

        // Initialize Usb Module
        await usb.connect(deployer).rely(usbJoin.address);

        // Initialize Collateral Module [User should approve gemJoin]

        // Initialize Rates Module
        await jug.connect(deployer).init(collateral); // Duty on next line already set here. It needs rho == now
        // await jug.connect(deployer)["file(bytes3 2,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("duty"), "1" + ray);
        await jug.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("base"), "2" + ray);
        // await jug.connect(deployer)["file(bytes32,address)"](ethers.utils.formatBytes32String("vow"), NULL_ADDRESS);

    });

    it('put collaterall and borrow', async function () {

        let s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal("0");

        // collateral == "aBNBc" == ilk

        // Open the vault for particular collateral
        // This function returns cdpId, but it is not accessible in tests
        await manager.connect(signer1).open(collateral, signer1.address);

        // Retrieve cdpId from cdpManager
        let cdpId = await manager.connect(signer1).last(signer1.address);
        console.log("CdpId: " + cdpId.toString());

        // Retrieve user `urn` address.
        // That's where ink(collateral balance) and art(outstanding stablecoin debt) is registered.
        let urnId = await manager.connect(signer1).urns(cdpId);
        console.log("UrnId: " + urnId.toString());

        //Mint some tokens for user
        await abnbc.connect(deployer).mint(signer1.address, ether("5000").toString());
        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("5000").toString());


        // Approve and send some collateral inside. collateral value == 400 == `dink`
        let dink = ether("400").toString();

        await abnbc.connect(signer1).approve(gemJoin.address, dink);
        // Join. NOTE the urnId here
        await gemJoin.connect(signer1).join(urnId, dink);
        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4600").toString());

        let s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal("0");

        // Locking collateral and borrowing USB
        // We want to draw 25 USB == `dart`
        let dart = ether("25");
        await manager.connect(signer1).frob(cdpId, dink, dart.toString());

        // Now we have debt with size `dart`
        let vatState = await vat.connect(signer1).urns(collateral, urnId);
        expect(vatState["art"].toString()).to.equal(ether("25").toString());

        // Need to withdraw newly minted USB to our wallet
        // dart is stored with 45 decimals
        let radDart = "25" + rad;

        // Move USB from urn to debt account
        await manager.connect(signer1).move(cdpId, signer1.address, radDart);
        // Approve USB gem against vat
        await vat.connect(signer1).hope(usbJoin.address);
        // Actually transfer USB to user's wallet
        await usbJoin.connect(signer1).exit(signer1.address, dart.toString());

        s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal(ether("25").toString());
    });
});