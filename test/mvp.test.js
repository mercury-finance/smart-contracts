const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers, network } = require('hardhat');
const Web3 = require('web3');
const {ether, expectRevert, BN, expectEvent} = require('@openzeppelin/test-helpers');

///////////////////////////////////////////
//Word of Notice: Commented means pending//
//The test will be updated on daily basis//
///////////////////////////////////////////

xdescribe('===MVP1===', function () {
    let deployer, signer1, signer2, mockVow;

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
        // 2.000000000000000000000000000 ($) * 0.8 (80%) = 1.600000000000000000000000000,
        // 2.000000000000000000000000000 / 1.600000000000000000000000000 = 1.250000000000000000000000000 = mat
        await oracle.connect(deployer).setPrice("2" + wad); // 2$, mat = 80%, 2$ * 80% = 1.6$ With Safety Margin

        // Initialize Core Module
        await vat.connect(deployer).init(collateral);
        await vat.connect(deployer).rely(gemJoin.address);
        await vat.connect(deployer).rely(usbJoin.address);
        await vat.connect(deployer).rely(spot.address);
        await vat.connect(deployer).rely(jug.address);
        await vat.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "2000" + rad); // Normalized USB
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "1200" + rad); // Normalized USB
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("dust"), "500" + rad); // Normalized USB
        // await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("spot"), "500" + rad);

        await spot.connect(deployer)["file(bytes32,bytes32,address)"](collateral, ethers.utils.formatBytes32String("pip"), oracle.address);
        await spot.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000"); // Liquidation Ratio
        await spot.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray); // It means pegged to 1$
        await spot.connect(deployer).poke(collateral);

        // Initialize Usb Module
        await usb.connect(deployer).rely(usbJoin.address);

        // Initialize Collateral Module [User should approve gemJoin while joining]

        // Initialize Rates Module
        // IMPORTANT: Base and Duty are added together first, thus will compound together.
        //            It is adviced to set a constant base first then duty for all ilks.
        //            Otherwise, a change in base rate will require a change in all ilks rate.
        //            Due to addition of both rates, the ratio should be adjusted by factoring.
        //            rate(Base) + rate(Duty) != rate(Base + Duty)

        // Calculating Base Rate (1% Yearly)
        // ==> principal*(rate**seconds)-principal = 0.01 (1%)
        // ==> 1 * (BR ** 31536000 seconds) - 1 = 0.01
        // ==> 1*(BR**31536000) = 1.01
        // ==> BR**31536000 = 1.01
        // ==> BR = 1.01**(1/31536000)
        // ==> BR = 1.000000000315529215730000000 [ray]

        // Factoring out Ilk Duty Rate (1% Yearly)
        // ((1 * (BR + 0.000000000312410000000000000 DR)^31536000)-1) * 100 = 0.000000000312410000000000000 = 2% (BR + DR Yearly)

        await jug.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("base"), "1000000000315529215730000000"); // 1% Yearly
        // Setting duty requires now == rho. So Drip then Set, or Init then Set.
        // await jug.connect(deployer).init(collateral); // Duty by default set here to 1 Ray which is 0%, but added to Base that makes its effect compound
        // await jug.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("duty"), "0000000000312410000000000000"); // 1% Yearly Factored

        // evm does not support stopping time for now == rho, so we create a mock contract which calls both functions to set duty
        let proxyLike = await (await (await ethers.getContractFactory("ProxyLike")).connect(deployer).deploy(jug.address, vat.address)).deployed();
        await jug.connect(deployer).rely(proxyLike.address);
        await proxyLike.connect(deployer).jugInitFile(collateral, ethers.utils.formatBytes32String("duty"), "0000000000312410000000000000"); // 1% Yearly Factored

        expect(await(await jug.base()).toString()).to.be.equal("1000000000315529215730000000")
        expect(await(await(await jug.ilks(collateral)).duty).toString()).to.be.equal("312410000000000000");

        await jug.connect(deployer)["file(bytes32,address)"](ethers.utils.formatBytes32String("vow"), mockVow.address);
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

        await network.provider.send("evm_mine");

        expect((await vat.connect(deployer).gem(collateral, signer1.address)).toString()).to.be.equal(await (ethers.utils.parseEther("400")).toString());
        expect((await vat.connect(deployer).gem(collateral, signer2.address)).toString()).to.be.equal(await (ethers.utils.parseEther("900")).toString());

        // Signer1 and Signer2 collateralize 400 and 900 respectively
        await vat.connect(signer1).frob(collateral, signer1.address, signer1.address, signer1.address, ethers.utils.parseEther("400"), 0); // 400 * 1.6$ = 640$ worth locked
        await network.provider.send("evm_mine");
        expect((await vat.connect(deployer).gem(collateral, signer1.address)).toString()).to.be.equal(await (ethers.utils.parseEther("0")).toString());
        expect((await (await vat.connect(deployer).urns(collateral, signer1.address)).ink).toString()).to.be.equal(await (ethers.utils.parseEther("400")).toString());

        await vat.connect(signer2).frob(collateral, signer2.address, signer2.address, signer2.address, ethers.utils.parseEther("900"), 0); // 900 * 1.6$ = 1440$ worth locked
        await network.provider.send("evm_mine");
        expect((await vat.connect(deployer).gem(collateral, signer2.address)).toString()).to.be.equal(await (ethers.utils.parseEther("0")).toString());
        expect((await (await vat.connect(deployer).urns(collateral, signer2.address)).ink).toString()).to.be.equal(await (ethers.utils.parseEther("900")).toString());

        // Signer1 and Signer2 borrow Usb respectively [Note: Can be done in a single frob collateralize and borrow]
        // Note borrows should be less than "Line/line" and greater than "dust"
        // Note "dart" parameter in the frob is normalized. dart = Usb amount / ilk.rate
        expect((await vat.connect(signer1).usb(signer1.address)).toString()).to.be.equal("0");
        expect((await vat.connect(signer1).debt()).toString()).to.be.equal("0");
        expect((await (await vat.connect(signer1).urns(collateral, signer1.address)).art).toString()).to.be.equal("0");
        expect((await (await vat.connect(signer1).ilks(collateral)).Art).toString()).to.be.equal("0");

        // Normalized dart [wad] = amount to borrow / ilk.rate
        let debt_rate = await (await vat.ilks(collateral)).rate;
        let usb_amount1 = (550000000000000000000 / debt_rate) * ONE;
        let usb_amount2 = (600000000000000000000 / debt_rate) * ONE;

        await vat.connect(signer1).frob(collateral, signer1.address, signer1.address, signer1.address, 0, usb_amount1.toString()); // 550 USBs
        await vat.connect(signer2).frob(collateral, signer2.address, signer2.address, signer2.address, 0, usb_amount2.toString()); // 600 USBs
        await network.provider.send("evm_mine");

        debt_rate = await (await vat.ilks(collateral)).rate;
        console.log("ILK_RATE      : " + debt_rate.toString());
        console.log("ink(signer1)  : " + await (await vat.urns(collateral, signer1.address)).ink);
        console.log("art(signer1)  : " + await (await (await vat.connect(signer1).urns(collateral, signer1.address)).art).toString());
        console.log("Art           : " + await (await (await vat.connect(signer1).ilks(collateral)).Art).toString());
        console.log("Usb(signer1)  : " + await (await vat.connect(signer1).usb(signer1.address)).toString());
        console.log("Debt          : " + await (await vat.connect(signer1).debt()).toString());

        // Update Stability Fees
        await network.provider.send("evm_increaseTime", [31536000]); // Jump 1 Year
        await jug.connect(deployer).drip(collateral);
        await network.provider.send("evm_mine");

        debt_rate = await (await vat.ilks(collateral)).rate;
        console.log("---After One Year");
        console.log("ILK_RATE      : " + debt_rate.toString());
        console.log("ink(signer1)  : " + await (await vat.urns(collateral, signer1.address)).ink);
        console.log("art(signer1)  : " + await (await (await vat.connect(signer1).urns(collateral, signer1.address)).art).toString());
        console.log("Art           : " + await (await (await vat.connect(signer1).ilks(collateral)).Art).toString());
        console.log("Usb(signer1)  : " + await (await vat.connect(signer1).usb(signer1.address)).toString());
        console.log("Debt          : " + await (await vat.connect(signer1).debt()).toString());
        let usbWithStabilityFee = (debt_rate * await (await vat.connect(signer1).urns(collateral, signer1.address)).art) / ONE; // rate * art = usb
        let stabilityFee = (usbWithStabilityFee - (await vat.connect(signer1).usb(signer1.address) / ONE)); // S.fee = usbWithStabilityFee - usb
        console.log("S.Fee(signer1): " + stabilityFee + "in USB (2% After One Year)");

        // Mint ERC20 Usb tokens based on internal Usb(signer1)
        await vat.connect(signer1).hope(usbJoin.address);
        expect((await usb.balanceOf(signer1.address)).toString()).to.equal("0");
        await usbJoin.connect(signer1).exit(signer1.address, ethers.utils.parseEther("300"));
        expect((await usb.balanceOf(signer1.address)).toString()).to.equal(ethers.utils.parseEther("300").toString());

        // Burn ERC20 Usb tokens to get internal Usb(signer1)
        await usb.connect(signer1).approve(usbJoin.address, ethers.utils.parseEther("300"))
        await usbJoin.connect(signer1).join(signer1.address, ethers.utils.parseEther("300"));
        expect((await usb.balanceOf(signer1.address)).toString()).to.equal("0");

        // Repaying all USB amount and closing the vault
        // Borrow the extra USB fee from market or Transfer from another vault
        console.log(await vat.usb(signer2.address));
        await vat.connect(signer2).hope(usbJoin.address);
        await usbJoin.connect(signer2).exit(signer1.address, ethers.utils.parseEther("20"));
        await usb.connect(signer1).approve(usbJoin.address, ethers.utils.parseEther("20"))
        await usbJoin.connect(signer1).join(signer1.address, ethers.utils.parseEther("20"));
        usb_amount1 = -550000000000000070000
        await vat.connect(signer1).frob(collateral, signer1.address, signer1.address, signer1.address, 0, usb_amount1.toString()); // 550 USBs

        debt_rate = await (await vat.ilks(collateral)).rate;
        console.log("---After Repaying USB");
        console.log("ILK_RATE      : " + debt_rate.toString());
        console.log("ink(signer1)  : " + await (await vat.urns(collateral, signer1.address)).ink);
        console.log("art(signer1)  : " + await (await (await vat.connect(signer1).urns(collateral, signer1.address)).art).toString());
        console.log("Art           : " + await (await (await vat.connect(signer1).ilks(collateral)).Art).toString());
        console.log("Usb(signer1)  : " + await (await vat.connect(signer1).usb(signer1.address)).toString());
        console.log("Debt          : " + await (await vat.connect(signer1).debt()).toString());
        await network.provider.send("evm_mine");
    });
});