const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers, network } = require('hardhat');
const Web3 = require('web3');
const {ether, expectRevert, BN, expectEvent} = require('@openzeppelin/test-helpers');

const Interaction = artifacts.require('DAOInteraction');

///////////////////////////////////////////
//Word of Notice: Commented means pending//
//The test will be updated on daily basis//
///////////////////////////////////////////

xdescribe('===INTERACTION2-Multicollateral===', function () {
    let deployer, signer1, signer2, mockVow;

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
        oracle2;

    let interaction;

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000", // 45 Decimals
        ONE = 10 ** 27;


    let collateral = ethers.utils.formatBytes32String("aBNBc");
    let collateral2 = ethers.utils.formatBytes32String("aBNBc2");

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

        // Core module
        vat = await this.Vat.connect(deployer).deploy();
        await vat.deployed();

        console.log(vat);

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
        // Collateral 2
        abnbc2 = await this.ABNBC.connect(deployer).deploy();
        await abnbc2.deployed(); // Collateral
        abnbcJoin2 = await this.GemJoin.connect(deployer).deploy(vat.address, collateral2, abnbc2.address);
        await abnbcJoin2.deployed();

        // Rates module
        jug = await this.Jug.connect(deployer).deploy(vat.address);
        await jug.deployed();

        // External
        oracle = await this.Oracle.connect(deployer).deploy();
        await oracle.deployed();
        oracle2 = await this.Oracle.connect(deployer).deploy();
        await oracle2.deployed();

        interaction = await Interaction.new({from: deployer.address});
        await interaction.initialize(
            vat.address,
            spot.address,
            usb.address,
            usbJoin.address,
            jug.address,
            ethers.constants.AddressZero
        );
        //////////////////////////////
        /** Initial Setup -------- **/
        //////////////////////////////

        // Initialize External
        // 2.000000000000000000000000000 ($) * 0.8 (80%) = 1.600000000000000000000000000,
        // 2.000000000000000000000000000 / 1.600000000000000000000000000 = 1.250000000000000000000000000 = mat
        await oracle.connect(deployer).setPrice("400" + wad); // 400$, mat = 80%, 400$ * 80% = 320$ With Safety Margin
        await oracle2.connect(deployer).setPrice("300" + wad); // 400$, mat = 80%, 400$ * 80% = 320$ With Safety Margin

        // Initialize Core Module
        // await vat.connect(deployer).init(collateral);
        // await vat.connect(deployer).rely(abnbcJoin.address);
        await vat.connect(deployer).rely(usbJoin.address);
        await vat.connect(deployer).rely(spot.address);
        await vat.connect(deployer).rely(jug.address);
        await vat.connect(deployer).rely(interaction.address);

        // await vat.connect(deployer).rely(jug.address);
        await vat.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "20000" + rad); // Normalized USB
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "2000" + rad);
        // await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("spot"), "500" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("dust"), "1" + rad);

        await spot.connect(deployer)["file(bytes32,bytes32,address)"](collateral, ethers.utils.formatBytes32String("pip"), oracle.address);
        await spot.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000"); // Liquidation Ratio
        await spot.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray); // It means pegged to 1$
        await spot.connect(deployer).poke(collateral);

        //Collateral2
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral2, ethers.utils.formatBytes32String("line"), "3000" + rad);
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral2, ethers.utils.formatBytes32String("dust"), "1" + rad);

        await spot.connect(deployer)["file(bytes32,bytes32,address)"](collateral2, ethers.utils.formatBytes32String("pip"), oracle2.address);
        await spot.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral2, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000"); // Liquidation Ratio
        await spot.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray); // It means pegged to 1$
        await spot.connect(deployer).poke(collateral2);


        // Initialize Usb Module
        await usb.connect(deployer).rely(usbJoin.address);

        // Stability fees
        //calculate base rate
        const year_seconds = 31536000;
        const rate_percent = 0.1; //10%;
        let fractionBR = (1 + rate_percent)**(1/year_seconds);
        // let BR = new BN(fractionBR)*10**27;
        let BR = new BN("1000000003022266000000000000").toString();
        console.log(BR);
        // await jug.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("base"), "1000000000315529215730000000"); // 1% Yearly
        await jug.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("base"), BR); // 1% Yearly
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

    it('dafaults', async function () {
        await interaction.setCollateralType(abnbc.address, abnbcJoin.address, collateral, {from: deployer.address});
        await interaction.setCollateralType(abnbc2.address, abnbcJoin2.address, collateral2, {from: deployer.address});

        // let ilk = await interaction.connect(deployer).ilk(abnbc.address);
        // console.log("Ilk: " + ilk);

        let abnbcPrice = await interaction.collateralPrice(abnbc.address, {from: signer1.address});
        expect(abnbcPrice.toString()).to.equal(ether("400").toString());
        let abnbcPrice2 = await interaction.collateralPrice(abnbc2.address, {from: signer1.address});
        expect(abnbcPrice2.toString()).to.equal(ether("300").toString());

        let rate1 = await interaction.collateralRate(abnbc.address, {from: signer1.address});
        expect(rate1.toString()).to.equal(ether("320").toString());
        let rate2 = await interaction.collateralRate(abnbc2.address, {from: signer1.address});
        expect(rate2.toString()).to.equal(ether("240").toString());

        let s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal("0");

        // collateral == "aBNBc" == ilk

        //Mint some tokens for user
        await abnbc.connect(deployer).mint(signer1.address, ether("5000").toString());
        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("5000").toString());

        await abnbc2.connect(deployer).mint(signer1.address, ether("400").toString());

        // Check initial state
        let free = await interaction.free(abnbc.address, signer1.address, {from: signer1.address});
        expect(free.toString()).to.equal("0");
        let locked = await interaction.locked(abnbc.address, signer1.address, {from: signer1.address});
        expect(locked.toString()).to.equal("0");

        let borrowApr = await interaction.borrowApr(abnbc.address, {from: signer1.address});
        expect(borrowApr.toString()).to.equal("10000000069041365947");
    });

    it('put collateral and borrow', async function () {
        // Approve and send some collateral inside. collateral value == 400 == `dink`
        let dink = ether("2").toString();

        await abnbc.connect(signer1).approve(interaction.address, dink);
        // Deposit collateral(aBNBc) to the interaction contract
        await interaction.deposit(abnbc.address, dink, {from: signer1.address});

        let s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4998").toString());

        let s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal("0");

        let free = await interaction.free(abnbc.address, signer1.address, {from: signer1.address});
        expect(free.toString()).to.equal("0");
        let locked = await interaction.locked(abnbc.address, signer1.address, {from: signer1.address});
        expect(locked.toString()).to.equal(ether("2").toString());

        // Locking collateral and borrowing USB
        // We want to draw 60 USB == `dart`
        // Maximum available for borrow = (2 * 400 ) * 0.8 = 640
        let dart = ether("60").toString();
        await interaction.borrow(abnbc.address, dart, {from: signer1.address});

        s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal(dart);

        free = await interaction.free(abnbc.address, signer1.address, {from: signer1.address});
        expect(free.toString()).to.equal("0");
        locked = await interaction.locked(abnbc.address, signer1.address, {from: signer1.address});
        expect(locked.toString()).to.equal(dink);
        s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal(dart);

        // User locked 2 aBNBc with price 400 and rate 0.8 == 640$ collateral worth
        // Borrowed 60$ => available should equal to 640 - 60 = 580.
        let available = await interaction.availableToBorrow(abnbc.address, signer1.address, {from: signer1.address});
        expect(available.toString()).to.equal(ether("580").toString());

        // 2 * 37.5 * 0.8 == 60$
        let liquidationPrice = await interaction.currentLiquidationPrice(abnbc.address, signer1.address, {from: signer1.address});
        expect(liquidationPrice.toString()).to.equal(ether("37.5").toString());
        // console.log("Liq.price is: " + liquidationPrice.toString());

        // ( 2 + 1 ) * 25 * 0.8 == 60$
        let estLiquidationPrice = await interaction.estimatedLiquidationPrice(
            abnbc.address, signer1.address, ether("1").toString(), {from: signer1.address}
        );
        expect(estLiquidationPrice.toString()).to.equal(ether("25").toString());
        console.log("Est.Liq.price is: " + estLiquidationPrice.toString());

        // Update Stability Fees
        await network.provider.send("evm_increaseTime", [31536000]); // Jump 1 Year
        await interaction.drip(abnbc.address, {from: signer1.address});
        await network.provider.send("evm_mine");

        availableYear = await interaction.availableToBorrow(abnbc.address, signer1.address, {from: signer1.address});
        expect(availableYear.toString()).to.equal("573999998163349153602"); //roughly 10 percents less.
    });

    // 100 BNB -> Ankr
    // 100 aBNBc <-- Ankr 7%
    // 100 aBNBc --> Helio
    // XXX DAI <-- Helio (mint)
    // DAI -> Jar contract (modified MakerDAO Pot) 10%
    // jar is similar to pot but pot has no rewards limit and the interest is based on the percentage of deposit
    // jar has rewards limit and interest is based on percentage share of deposits from fixed emission
    // DAI*(1 + fees%) --> Helio
    // MKR token <-- Helio (amount of MKR == stability fee)

    it('payback and withdraw', async function() {
        let dart = ether("60").toString();

        // let vatState = await vat.connect(signer1).urns(collateral, signer1.address);
        // console.log(vatState);

        let s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4998").toString());
        let s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal(dart);

        await usb.connect(signer1).approve(interaction.address, dart);
        await interaction.payback(abnbc.address, dart, {from: signer1.address});

        s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal("0");
        // let ilk = await vat.connect(signer1).ilks(collateral);
        // console.log(ilk);

        // vatState = await vat.connect(signer1).urns(collateral, signer1.address);
        // console.log(vatState);

        let available = await interaction.availableToBorrow(abnbc.address, signer1.address, {from: signer1.address});
        expect(available.toString()).to.equal("633999998163349153601");

        let willBeAvailable = await interaction.willBorrow(
            abnbc.address, signer1.address, ether("1").toString(), {from: signer1.address}
        );
        expect(willBeAvailable.toString()).to.equal("953999998163349153601");

        // USB are burned, now we have to withdraw collateral
        // We will always withdraw all available collateral
        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4998").toString());

        let free = await interaction.free(abnbc.address, signer1.address, {from: signer1.address});
        expect(free.toString()).to.equal("0");

        await interaction.withdraw(abnbc.address, ether("1").toString(), {from: signer1.address});

        s1Balance = (await abnbc.balanceOf(signer1.address)).toString();
        expect(s1Balance).to.equal(ether("4999").toString());
    });
});