const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { joinSignature } = require('ethers/lib/utils');
const { ethers, network } = require('hardhat');
const Web3 = require('web3');

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const DATA = "0x02";

describe('===Jar===', function () {
    let deployer, signer1, signer2, signer3;

    let vat, 
        spot, 
        abnbc,
        husb, 
        gemJoin, 
        jug,
        vow,
        jar;

    let oracle;

    let wad = "000000000000000000", // 18 Decimals
        ray = "000000000000000000000000000", // 27 Decimals
        rad = "000000000000000000000000000000000000000000000", // 45 Decimals
        ONE = 10 ** 27;


    let collateral = ethers.utils.formatBytes32String("aBNBc");

    beforeEach(async function () {

        ////////////////////////////////
        /** Deployments ------------ **/
        ////////////////////////////////

        [deployer, signer1, signer2, signer3] = await ethers.getSigners();

        this.Vat = await ethers.getContractFactory("Vat");
        this.Spot = await ethers.getContractFactory("Spotter");
        this.GemJoin = await ethers.getContractFactory("GemJoin");
        this.UsbJoin = await ethers.getContractFactory("UsbJoin");
        this.Usb = await ethers.getContractFactory("Usb");
        this.Jug = await ethers.getContractFactory("Jug");
        this.Vow = await ethers.getContractFactory("Vow");
        this.Jar = await ethers.getContractFactory("Jar");
        this.Oracle = await ethers.getContractFactory("Oracle"); // Mock Oracle

        // Core module
        vat = await this.Vat.connect(deployer).deploy();
        await vat.deployed();
        spot = await this.Spot.connect(deployer).deploy(vat.address);
        await spot.deployed();

        // Collateral module
        abnbc = await this.Usb.connect(deployer).deploy(97);
        await abnbc.deployed(); // Collateral
        gemJoin = await this.GemJoin.connect(deployer).deploy(vat.address, collateral, abnbc.address);
        await gemJoin.deployed();
        
        // Rates module
        jug = await this.Jug.connect(deployer).deploy(vat.address);
        await jug.deployed();

        // System Stabilizer module (balance sheet)
        vow = await this.Vow.connect(deployer).deploy(vat.address, NULL_ADDRESS, NULL_ADDRESS);
        await vow.deployed();

        // Jar module 
        jar = await this.Jar.connect(deployer).deploy(vat.address, vow.address);
        await jar.deployed();

        // Oracle module
        oracle = await this.Oracle.connect(deployer).deploy();
        await oracle.deployed();

        //////////////////////////////
        /** Initial Setup -------- **/
        //////////////////////////////

        // Initialize Oracle Module
        // 2.000000000000000000000000000 ($) * 0.8 (80%) = 1.600000000000000000000000000, 
        // 2.000000000000000000000000000 / 1.600000000000000000000000000 = 1.250000000000000000000000000 = mat
        await oracle.connect(deployer).setPrice("2" + wad); // 2$, mat = 80%, 2$ * 80% = 1.6$ With Safety Margin

        // Initialize Core Module 
        await vat.connect(deployer).init(collateral);
        await vat.connect(deployer).rely(gemJoin.address);
        await vat.connect(deployer).rely(spot.address);
        await vat.connect(deployer).rely(jug.address);
        await vat.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("Line"), "5000" + rad); // Normalized USB
        await vat.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("line"), "5000" + rad); // Normalized USB

        await spot.connect(deployer)["file(bytes32,bytes32,address)"](collateral, ethers.utils.formatBytes32String("pip"), oracle.address);
        await spot.connect(deployer)["file(bytes32,bytes32,uint256)"](collateral, ethers.utils.formatBytes32String("mat"), "1250000000000000000000000000"); // Liquidation Ratio
        await spot.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("par"), "1" + ray); // It means pegged to 1$
        await spot.connect(deployer).poke(collateral);

        // Initialize Collateral Module [User should approve gemJoin while joining]

        // Initialize Rates Module
        await jug.connect(deployer)["file(bytes32,uint256)"](ethers.utils.formatBytes32String("base"), "1000000000315529215730000000"); // 1% Yearly
        // evm does not support stopping time for now == rho, so we create a mock contract which calls both functions to set duty
        let proxyLike = await (await (await ethers.getContractFactory("ProxyLike")).connect(deployer).deploy(jug.address, vat.address)).deployed();
        await jug.connect(deployer).rely(proxyLike.address);
        await proxyLike.connect(deployer).jugInitFile(collateral, ethers.utils.formatBytes32String("duty"), "0000000000312410000000000000"); // 1% Yearly Factored
        await jug.connect(deployer)["file(bytes32,address)"](ethers.utils.formatBytes32String("vow"), vow.address);

        // Initialize Jar Module
        husb = await this.Usb.connect(deployer).deploy(97);
        await husb.deployed(); // The derivative token. Non Transferable
        husb.connect(deployer).rely(jar.address);

        // Signer1, Signer2 and Signer3 have some aBNBc
        await abnbc.connect(deployer).mint(signer1.address, ethers.utils.parseEther("5000"));
        await abnbc.connect(deployer).mint(signer2.address, ethers.utils.parseEther("5000"));
        await abnbc.connect(deployer).mint(signer3.address, ethers.utils.parseEther("5000"));

        // Signer1, Signer2 and Signer3 entered the system with 1000, 2000, and 3000 respectively (Unlocked)
        await abnbc.connect(signer1).approve(gemJoin.address, ethers.utils.parseEther("1000"));
        await gemJoin.connect(signer1).join(signer1.address, ethers.utils.parseEther("1000"));
        await abnbc.connect(signer2).approve(gemJoin.address, ethers.utils.parseEther("2000"));
        await gemJoin.connect(signer2).join(signer2.address, ethers.utils.parseEther("2000"));
        await abnbc.connect(signer3).approve(gemJoin.address, ethers.utils.parseEther("3000"));
        await gemJoin.connect(signer3).join(signer3.address, ethers.utils.parseEther("3000"));
        
        // Signer1, Signer2 and Signer3 collateralize 500, 1000 and 1500 respectively
        await vat.connect(signer1).frob(collateral, signer1.address, signer1.address, signer1.address, ethers.utils.parseEther("500"), 0); // 500 * 1.6$ = 800$ worth locked
        await vat.connect(signer2).frob(collateral, signer2.address, signer2.address, signer2.address, ethers.utils.parseEther("1000"), 0); // 1000 * 1.6$ = 1600$ worth locked
        await vat.connect(signer3).frob(collateral, signer3.address, signer3.address, signer3.address, ethers.utils.parseEther("1500"), 0); // 1500 * 1.6$ = 2400$ worth locked

        // // Signer1, Signer2 and Signer2 borrow Usb respectively
        let debt_rate = await (await vat.ilks(collateral)).rate;
        let usb_amount1 = (400000000000000000000 / debt_rate) * ONE;
        let usb_amount2 = (800000000000000000000 / debt_rate) * ONE;
        let usb_amount3 = "1200000000000000000000";
    
        await vat.connect(signer1).frob(collateral, signer1.address, signer1.address, signer1.address, 0, usb_amount1.toString()); // 400 USBs
        await vat.connect(signer2).frob(collateral, signer2.address, signer2.address, signer2.address, 0, usb_amount2.toString()); // 800 USBs
        await vat.connect(signer3).frob(collateral, signer3.address, signer3.address, signer3.address, 0, usb_amount3); // 1200 USBs
        await network.provider.send("evm_mine");
        await network.provider.send("evm_setAutomine", [false]);
        // await network.provider.send("evm_setNextBlockTimestamp", ["TIME"]) 
        // await hre.ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60]);

        await network.provider.send("evm_mine")
        debt_rate = await (await vat.ilks(collateral)).rate;
        // console.log("ILK_RATE      : " + debt_rate.toString());
        // console.log("Usb(signer1)  : " + await (await vat.connect(signer1).usb(signer3.address)).toString());
        // console.log("Debt          : " + await (await vat.connect(signer1).debt()).toString());

        // Update Stability Fees
        await network.provider.send("evm_increaseTime", [157680000]); // Jump 5 Year
        await jug.connect(deployer).drip(collateral);
        await network.provider.send("evm_mine");
        
        debt_rate = await (await vat.ilks(collateral)).rate;
        // console.log("---After One Year");
        // console.log("ILK_RATE      : " + debt_rate.toString());
        // console.log("Debt          : " + await (await vat.connect(signer1).debt()).toString());
        // let usbWithStabilityFee = (debt_rate * await (await vat.connect(signer1).urns(collateral, signer1.address)).art) / ONE; // rate * art = usb 
        // let stabilityFee = (usbWithStabilityFee - (await vat.connect(signer1).usb(signer1.address) / ONE)); // S.fee = usbWithStabilityFee - usb
        // console.log("S.Fee(signer1): " + stabilityFee + " in USB (2% After 5 Years)");

        // Vat has surplus amount of about 249 USBs now because stability fees
        await network.provider.send("evm_setAutomine", [true]);
    });

    describe('---file', function () {
        it('reverts Jar/not-live', async function () {
            await jar.connect(deployer).cage();
            let time = (await ethers.provider.getBlock()).timestamp;
            await expect(jar.connect(deployer).file(ethers.utils.formatBytes32String("plate"), ethers.utils.parseEther("200"), time + 5, time + 30, husb.address)).to.be.revertedWith("Jar/not-live");
        });
        it('reverts Jar/wrong-interval', async function () {
            let time = (await ethers.provider.getBlock()).timestamp;
            await expect(jar.connect(deployer).file(ethers.utils.formatBytes32String("plate"), ethers.utils.parseEther("200"), time + 50, time + 4, husb.address)).to.be.revertedWith("Jar/wrong-interval");
        });
        it('reverts Jar/file-unrecognized-param', async function () {
            let time = (await ethers.provider.getBlock()).timestamp;
            await expect(jar.connect(deployer).file(ethers.utils.formatBytes32String("asdf"), ethers.utils.parseEther("200"), time + 5, time + 40, husb.address)).to.be.revertedWith("Jar/file-unrecognized-param");
        });
        it('should create new plate via file', async function () {
            let time = (await ethers.provider.getBlock()).timestamp;
            await vow.connect(deployer).permit(jar.address, 1);
            await jar.connect(deployer).file(ethers.utils.formatBytes32String("plate"), ethers.utils.parseEther("200"), time + 5, time + 40, husb.address);
        });
    })

    describe('---join ---exit', function () {
        it('reverts join Jar/not-live', async function () {
            await jar.connect(deployer).cage();
            let time = (await ethers.provider.getBlock()).timestamp;
            await expect(jar.connect(deployer).join("100" + wad)).to.be.revertedWith("Jar/not-live");
        });

        it('Case 1: Before "check", join-claim-exit', async function () {

            await network.provider.send("evm_setAutomine", [false]);
            let tau;

            {
                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);
                await network.provider.send("evm_mine");
                // console.log((await ethers.provider.getBlock()).timestamp)
            }

            {
                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vow.connect(deployer).permit(jar.address, 1);
                await jar.connect(deployer).file(ethers.utils.formatBytes32String("plate"), ethers.utils.parseEther("200"), tau + 50, tau + 100, husb.address); // 4 USB per second

                await network.provider.send("evm_mine"); // 49 sec to start

                expect(await vat.usb(jar.address)).to.equal("200" + rad);
                expect((await jar.plates(1)).end - (await jar.plates(1)).start).to.equal(50);
                expect((await jar.plates(1)).rate).to.equal("4" + wad);

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vat.connect(signer1).hope(jar.address);
                await jar.connect(signer1).join("10" + wad);

                await network.provider.send("evm_mine"); // 48 sec to start

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vat.connect(signer2).hope(jar.address);
                await jar.connect(signer2).join("5" + wad);

                await network.provider.send("evm_mine"); // 47 sec to start

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vat.connect(signer3).hope(jar.address);
                await jar.connect(signer3).join("5" + wad);

                await network.provider.send("evm_mine"); // 46 sec to start

                expect(await husb.balanceOf(signer1.address)).to.equal("10" + wad);
                expect(await husb.balanceOf(signer2.address)).to.equal("5" + wad);
                expect(await husb.balanceOf(signer3.address)).to.equal("5" + wad);
                expect((await jar.plates(1)).Pile).to.equal("20" + wad);
                expect((await jar.plates(1)).fps).to.equal("0");

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await jar.connect(signer1).exit(1, "5" + wad); // Can not exit cuz end hasn't reached
                await jar.connect(signer2).exit(1, "0" + wad);
                await jar.connect(signer3).exit(1, "5" + wad); // Can not exit cuz end hasn't reached

                await network.provider.send("evm_mine"); // 45 sec to start

                expect(await husb.balanceOf(signer1.address)).to.equal("10" + wad);
                expect(await husb.balanceOf(signer2.address)).to.equal("5" + wad);
                expect(await husb.balanceOf(signer3.address)).to.equal("5" + wad);
                expect((await jar.plates(1)).Pile).to.equal("20" + wad);
                expect((await jar.plates(1)).fps).to.equal("0");

                // console.log((await jar.plates(1)).start - (await ethers.provider.getBlock()).timestamp);
                await network.provider.send("evm_setAutomine", [true]);
            }
        });

        it('Case 2: After "check", join-claim', async function () {

            await network.provider.send("evm_setAutomine", [false]);
            let tau;

            {
                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);
                await network.provider.send("evm_mine");
                // console.log((await ethers.provider.getBlock()).timestamp)
            }

            {
                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vow.connect(deployer).permit(jar.address, 1);
                await jar.connect(deployer).file(ethers.utils.formatBytes32String("plate"), ethers.utils.parseEther("200"), tau + 1, tau + 51, husb.address); // 4 USB per second

                await network.provider.send("evm_mine"); // Started 0 sec

                expect(await vat.usb(jar.address)).to.equal("200" + rad);
                expect((await jar.plates(1)).end - (await jar.plates(1)).start).to.equal(50);
                expect((await jar.plates(1)).rate).to.equal("4" + wad);

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);
                
                await vat.connect(signer1).hope(jar.address);
                await jar.connect(signer1).join("10" + wad);
                
                await network.provider.send("evm_mine"); // Started 1 sec

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vat.connect(signer2).hope(jar.address);
                await jar.connect(signer2).join("5" + wad);

                await network.provider.send("evm_mine"); // Started 2 sec

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vat.connect(signer3).hope(jar.address);
                await jar.connect(signer3).join("5" + wad);

                await network.provider.send("evm_mine"); // Started 3 sec

                expect(await husb.balanceOf(signer1.address)).to.equal("10" + wad);
                expect(await husb.balanceOf(signer2.address)).to.equal("5" + wad);
                expect(await husb.balanceOf(signer3.address)).to.equal("5" + wad);
                expect((await jar.plates(1)).Pile).to.equal("20" + wad);
                expect((await jar.plates(1)).fps).to.equal("666666666666666666666666666");
                expect(await jar.Eaten()).to.equal("0");

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 5]);

                await jar.connect(signer3).exit(1, "0" + wad);

                await network.provider.send("evm_mine"); // Started 8 sec

                expect(await husb.balanceOf(signer1.address)).to.equal("10" + wad);
                expect(await husb.balanceOf(signer2.address)).to.equal("5" + wad);
                expect(await husb.balanceOf(signer3.address)).to.equal("5" + wad);
                expect((await jar.plates(1)).Pile).to.equal("20" + wad);
                expect(await jar.Eaten()).to.equal("5000000000000000000"); // Signer3 '5' claimed

                // console.log((await jar.plates(1)).start - (await ethers.provider.getBlock()).timestamp);

                await network.provider.send("evm_setAutomine", [true]);
            }
        });

        it('Case 3: After "end", join-claim-exit', async function () {

            await network.provider.send("evm_setAutomine", [false]);
            let tau;

            {
                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);
                await network.provider.send("evm_mine");
                // console.log((await ethers.provider.getBlock()).timestamp)
            }

            {
                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vow.connect(deployer).permit(jar.address, 1);
                await jar.connect(deployer).file(ethers.utils.formatBytes32String("plate"), ethers.utils.parseEther("200"), tau + 1, tau + 51, husb.address); // 4 USB per second

                await network.provider.send("evm_mine"); // Started 0 sec

                expect(await vat.usb(jar.address)).to.equal("200" + rad);
                expect((await jar.plates(1)).end - (await jar.plates(1)).start).to.equal(50);
                expect((await jar.plates(1)).rate).to.equal("4" + wad);

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);
                
                await vat.connect(signer1).hope(jar.address);
                await jar.connect(signer1).join("10" + wad);
                
                await network.provider.send("evm_mine"); // Started 1 sec

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vat.connect(signer2).hope(jar.address);
                await jar.connect(signer2).join("5" + wad);

                await network.provider.send("evm_mine"); // Started 2 sec

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await vat.connect(signer3).hope(jar.address);
                await jar.connect(signer3).join("5" + wad);

                await network.provider.send("evm_mine"); // Started 3 sec

                expect(await husb.balanceOf(signer1.address)).to.equal("10" + wad);
                expect(await husb.balanceOf(signer2.address)).to.equal("5" + wad);
                expect(await husb.balanceOf(signer3.address)).to.equal("5" + wad);
                expect((await jar.plates(1)).Pile).to.equal("20" + wad);
                expect((await jar.plates(1)).fps).to.equal("666666666666666666666666666");
                expect(await jar.Eaten()).to.equal("0");

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 47]);

                await jar.connect(signer1).join("10" + wad);
                await jar.connect(signer2).join("0" + wad);
                await jar.connect(signer3).join("0" + wad);

                await network.provider.send("evm_mine"); // Started 50 sec

                expect(await husb.balanceOf(signer1.address)).to.equal("20" + wad);
                expect((await jar.people(1, signer1.address)).spoon).to.equal("100666666666666666666");
                expect(await husb.balanceOf(signer2.address)).to.equal("5" + wad);
                expect((await jar.people(1, signer2.address)).spoon).to.equal("48333333333333333333");
                expect(await husb.balanceOf(signer3.address)).to.equal("5" + wad);
                expect((await jar.people(1, signer3.address)).spoon).to.equal("47000000000000000000");
                expect((await jar.plates(1)).Pile).to.equal("30" + wad);
                expect(await jar.Eaten()).to.equal("0");

                tau = (await ethers.provider.getBlock()).timestamp;
                await network.provider.send("evm_setNextBlockTimestamp", [tau + 1]);

                await jar.connect(signer1).exit(1, "0" + wad);
                await jar.connect(signer2).exit(1, "0" + wad);
                await jar.connect(signer3).exit(1, "0" + wad);

                await network.provider.send("evm_mine"); // Started 51 sec

                expect(await husb.balanceOf(signer1.address)).to.equal("20" + wad);
                expect((await jar.people(1, signer1.address)).spoon).to.equal("0");
                expect(await husb.balanceOf(signer2.address)).to.equal("5" + wad);
                expect((await jar.people(1, signer2.address)).spoon).to.equal("0");
                expect(await husb.balanceOf(signer3.address)).to.equal("5" + wad);
                expect((await jar.people(1, signer3.address)).spoon).to.equal("0");
                expect((await jar.plates(1)).Pile).to.equal("30" + wad);
                expect(await jar.Eaten()).to.equal("195999999999999999999");

                // console.log((await jar.plates(1)).start - (await ethers.provider.getBlock()).timestamp);

                await network.provider.send("evm_setAutomine", [true]);
            }
        });
    })
});