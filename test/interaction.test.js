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
        let dart = ether("600");
        await manager.connect(signer1).frob(cdpId, dink, dart.toString());

        // Now we have debt with size `dart`
        let vatState = await vat.connect(signer1).urns(collateral, urnId);
        expect(vatState["art"].toString()).to.equal(ether("600").toString());

        // Need to withdraw newly minted USB to our wallet
        // dart is stored with 45 decimals
        let radDart = "600" + rad;

        // Move USB from urn to debt account
        await manager.connect(signer1).move(cdpId, signer1.address, radDart);
        // Approve USB gem against vat
        await vat.connect(signer1).hope(usbJoin.address);
        // Actually transfer USB to user's wallet
        await usbJoin.connect(signer1).exit(signer1.address, dart.toString());

        s1USBBalance = (await usb.balanceOf(signer1.address)).toString();
        expect(s1USBBalance).to.equal(ether("600").toString());
    });
});