const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers, network } = require('hardhat');
const Web3 = require('web3');
const {ether, expectRevert, BN, expectEvent} = require('@openzeppelin/test-helpers');

const VAT = artifacts.require('Vat');
const SPOT = artifacts.require("Spotter");
const USB = artifacts.require("Usb");
const ABNBC = artifacts.require("aBNBc");
const GemJoin = artifacts.require("GemJoin");
const UsbJoin = artifacts.require("UsbJoin");
const Jug = artifacts.require("Jug");
const Oracle = artifacts.require("Oracle"); // Mock Oracle
const Interaction = artifacts.require("DAOInteraction"); // Mock Oracle

xdescribe('===Interaction===', function () {

    let vat,
        spot,
        usb,
        abnbc,
        abnbcJoin,
        abnbc2,
        abnbcJoin2,
        usbJoin,
        jug,
        oracle,
        oracle2,
        interaction;

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000", // 45 Decimals
        ONE = 10 ** 27;


    let collateral = ethers.utils.formatBytes32String("aBNBc");
    let collateral2 = ethers.utils.formatBytes32String("aBNBc2");

    beforeEach(async function () {
        vat = await VAT.new({from: deployer});
        spot = await SPOT.new(vat.address, {from: deployer});

        //USB
        usb = await USB.new(97, {from: deployer});
        usbJoin = await UsbJoin.new(vat.address, usb.address, {from: deployer});

        // Collateral module
        abnbc = await ABNBC.new({from: deployer});
        abnbcJoin = await GemJoin.new(vat.address, collateral, abnbc.address, {from: deployer});
        // Collateral 2
        abnbc2 = await ABNBC.new({from: deployer});
        abnbcJoin2 = await GemJoin.new(vat.address, collateral2, abnbc2.address, {from: deployer});

        jug = await Jug.new(vat.address, {from:deployer});
        // External
        oracle = await Oracle.new({from:deployer})
        oracle2 = await Oracle.new({from:deployer});

        interaction = await Interaction.new({from: deployer});
        await interaction.initialize(
            vat.address,
            spot.address,
            usb.address,
            usbJoin.address,
            jug.address,
        );
        //////////////////////////////
        /** Initial Setup -------- **/
        //////////////////////////////
        // Initialize External
        // 2.000000000000000000000000000 ($) * 0.8 (80%) = 1.600000000000000000000000000,
        // 2.000000000000000000000000000 / 1.600000000000000000000000000 = 1.250000000000000000000000000 = mat
        await oracle.setPrice("400" + wad, {from: deployer}); // 400$, mat = 80%, 400$ * 80% = 320$ With Safety Margin
        await oracle2.setPrice("300" + wad, {from: deployer}); // 400$, mat = 80%, 400$ * 80% = 320$ With Safety Margin

        // Initialize Core Module
        // await vat.connect(deployer).init(collateral);
        // await vat.connect(deployer).rely(abnbcJoin.address);
        await vat.rely(usbJoin.address, {from: deployer});
        await vat.rely(spot.address, {from: deployer});
        await vat.rely(jug.address, {from: deployer});
        await vat.rely(interaction.address, {from: deployer});

        // await vat.connect(deployer).rely(jug.address);
        await vat["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "20000" + rad); // Normalized USB
        await vat["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "2000" + rad, {from: deployer});
        // await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("spot"), "500" + rad);
        await vat["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("dust"), "1" + rad, {from: deployer});

        await spot["file(bytes32,bytes32,address)"](collateral, ethers.utils.formatBytes32String("pip"), oracle.address, {from: deployer});
        await spot["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000", {from: deployer}); // Liquidation Ratio
        await spot["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray, {from: deployer}); // It means pegged to 1$
        await spot.poke(collateral, {from: deployer});

        //Collateral2
        await vat["file(bytes32,bytes32,uint256)"](collateral2, ethers.utils.formatBytes32String("line"), "3000" + rad, {from: deployer});
        await vat["file(bytes32,bytes32,uint256)"](collateral2, ethers.utils.formatBytes32String("dust"), "1" + rad, {from: deployer});

        await spot["file(bytes32,bytes32,address)"](collateral2, ethers.utils.formatBytes32String("pip"), oracle2.address, {from: deployer});
        await spot["file(bytes32,bytes32,uint256)"](collateral2, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000", {from: deployer}); // Liquidation Ratio
        await spot["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray, {from: deployer}); // It means pegged to 1$
        await spot.poke(collateral2, {from: deployer});


        // Initialize Usb Module
        await usb.rely(usbJoin.address, {from: deployer});

        // Stability fees
        //calculate base rate
        const year_seconds = 31536000;
        const rate_percent = 0.1; //10%;
        let fractionBR = (1 + rate_percent)**(1/year_seconds);
        // let BR = new BN(fractionBR)*10**27;
        let BR = new BN("1000000003022266000000000000").toString();
        console.log(BR);
        // await jug.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("base"), "1000000000315529215730000000"); // 1% Yearly
        await jug["file(bytes32,uint256)"](ethers.utils.formatBytes32String("base"), BR, {from: deployer}); // 1% Yearly
        // Setting duty requires now == rho. So Drip then Set, or Init then Set.
        // await jug.connect(deployer).init(collateral); // Duty by default set here to 1 Ray which is 0%, but added to Base that makes its effect compound
        // await jug.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("duty"), "0000000000312410000000000000"); // 1% Yearly Factored

        // evm does not support stopping time for now == rho, so we create a mock contract which calls both functions to set duty
        let proxyLike = await (await (await ethers.getContractFactory("ProxyLike")).connect(deployer).deploy(jug.address, vat.address)).deployed();
        await jug.connect(deployer).rely(proxyLike.address);
        await proxyLike.connect(deployer).jugInitFile(collateral, ethers.utils.formatBytes32String("duty"), "0");
        await proxyLike.connect(deployer).jugInitFile(collateral2, ethers.utils.formatBytes32String("duty"), "0000000000312410000000000000"); // 1% Yearly Factored

        expect(await(await jug.base()).toString()).to.be.equal(BR);
        expect(await(await(await jug.ilks(collateral)).duty).toString()).to.be.equal("0");
        expect(await(await(await jug.ilks(collateral2)).duty).toString()).to.be.equal("312410000000000000");

        await jug.connect(deployer)["file(bytes32,address)"](ethers.utils.formatBytes32String("vow"), mockVow.address);
    });

    it('defaults', async function() {
        await interaction.setCollateralType(abnbc.address, abnbcJoin.address, collateral, {from: deployer.address});
        await interaction.setCollateralType(abnbc2.address, abnbcJoin2.address, collateral2, {from: deployer.address});
        console.log(vat.address);
    });
});