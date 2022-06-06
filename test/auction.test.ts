import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers, upgrades } from "hardhat";
import { solidity } from "ethereum-waffle";

import NetworkSnapshotter from "./helpers/NetworkSnapshotter";
import { toWad, toRay, toRad, advanceTime } from "./helpers/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  ABNBc,
  ABNBc__factory,
  AuctionProxy,
  Clipper,
  DAOInteraction,
  Dog,
  GemJoin,
  HelioRewards,
  HelioToken,
  Jug,
  LinearDecrease,
  MockERC20,
  MockHelioProvider,
  Oracle,
  SlidingWindowOracle,
  Spotter,
  Usb,
  UsbJoin,
  Vat,
  Vow,
} from "../typechain-types";

chai.use(solidity);
chai.use(chaiAsPromised);

const { expect } = chai;
const BigNumber = ethers.BigNumber;
const toBytes32 = ethers.utils.formatBytes32String;

const ten = BigNumber.from(10);
const wad = ten.pow(18);
const ray = ten.pow(27);
const rad = ten.pow(45);

describe("Auction", () => {
  const networkSnapshotter = new NetworkSnapshotter();

  let deployer: SignerWithAddress;
  let signer1: SignerWithAddress;
  let signer2: SignerWithAddress;
  let signer3: SignerWithAddress;
  let abacus: LinearDecrease;
  let vat: Vat;
  let spot: Spotter;
  let usb: Usb;
  let abnbc: ABNBc;
  let abnbcJoin: GemJoin;
  let usbJoin: UsbJoin;
  let jug: Jug;
  let oracle: Oracle;
  let clip: Clipper;
  let dog: Dog;
  let vow: Vow;
  let helioToken: HelioToken;
  let rewards: HelioRewards;
  let auctionProxy: AuctionProxy;
  let interaction: DAOInteraction;

  const collateral = toBytes32("aBNBc");

  const deployContracts = async () => {
    const Vat = await ethers.getContractFactory("Vat");
    const Spot = await ethers.getContractFactory("Spotter");
    const Usb = await ethers.getContractFactory("Usb");
    const ABNBC: ABNBc__factory = (await ethers.getContractFactory("aBNBc")) as ABNBc__factory;
    const GemJoin = await ethers.getContractFactory("GemJoin");
    const UsbJoin = await ethers.getContractFactory("UsbJoin");
    const Jug = await ethers.getContractFactory("Jug");
    const Oracle = await ethers.getContractFactory("Oracle"); // Mock Oracle
    const Dog = await ethers.getContractFactory("Dog");
    const Clipper = await ethers.getContractFactory("Clipper");
    const LinearDecrease = await ethers.getContractFactory("LinearDecrease");
    const Vow = await ethers.getContractFactory("Vow");
    const HelioToken = await ethers.getContractFactory("HelioToken");
    const HelioRewards = await ethers.getContractFactory("HelioRewards");
    const AuctionProxy = await ethers.getContractFactory("AuctionProxy");
    const DAOInteraction = await ethers.getContractFactory("DAOInteraction");
    const PriceOracle = await ethers.getContractFactory("PriceOracle");
    const PancakeOracle = await ethers.getContractFactory("SlidingWindowOracle");

    // Abacus
    abacus = await LinearDecrease.connect(deployer).deploy();
    await abacus.deployed();

    // Core module
    vat = await Vat.connect(deployer).deploy();
    await vat.deployed();
    spot = await Spot.connect(deployer).deploy(vat.address);
    await spot.deployed();

    // Usb module
    usb = await Usb.connect(deployer).deploy(97, "USB");
    await usb.deployed(); // Stable Coin
    usbJoin = await UsbJoin.connect(deployer).deploy(vat.address, usb.address);
    await usbJoin.deployed();

    // Collateral module
    abnbc = await ABNBC.connect(deployer).deploy("ABNBC", "aBNBc");
    await abnbc.deployed(); // Collateral
    abnbcJoin = await GemJoin.connect(deployer).deploy(vat.address, collateral, abnbc.address);
    await abnbcJoin.deployed();

    // Rates module
    jug = await Jug.connect(deployer).deploy(vat.address);
    await jug.deployed();

    // External
    oracle = await Oracle.connect(deployer).deploy();
    await oracle.deployed();

    // Auction modules
    dog = await Dog.connect(deployer).deploy(vat.address);
    await dog.deployed();
    clip = await Clipper.connect(deployer).deploy(
      vat.address,
      spot.address,
      dog.address,
      collateral
    );
    await clip.deployed();

    // vow
    vow = await Vow.connect(deployer).deploy(
      vat.address,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      deployer.address
    );
    await vow.deployed();

    // helioToken
    helioToken = await HelioToken.deploy();
    await helioToken.deployed();

    // helioRewards
    rewards = await HelioRewards.deploy(vat.address);
    await rewards.deployed();

    // auctionProxy
    auctionProxy = await AuctionProxy.deploy();

    interaction = (await upgrades.deployProxy(DAOInteraction, [
      vat.address,
      spot.address,
      usb.address,
      usbJoin.address,
      jug.address,
      dog.address,
      rewards.address,
      auctionProxy.address,
    ])) as DAOInteraction;

    // const pancakeOracle = (await upgrades.deployProxy(
    //   PancakeOracle,
    //   [ethers.constants.AddressZero, 10000, 10],
    //   { kind: "uups" }
    // )) as SlidingWindowOracle;
    // console.log(pancakeOracle.address);
    
    // const priceOracle = (await upgrades.deployProxy(
    //   PriceOracle,
    //   [abnbc.address, pancakeOracle.address, true],
    //   { kind: "uups" }
    // )) as SlidingWindowOracle;
    // console.log(priceOracle.address);
  };

  const configureAbacus = async () => {
    await abacus.connect(deployer).file(toBytes32("tau"), "1800");
  };

  const configureOracles = async () => {
    const collateral1Price = toWad("400");
    await oracle.connect(deployer).setPrice(collateral1Price);
  };

  const configureVat = async () => {
    await vat.connect(deployer).rely(usbJoin.address);
    await vat.connect(deployer).rely(spot.address);
    await vat.connect(deployer).rely(jug.address);
    await vat.connect(deployer).rely(auctionProxy.address);
    await vat.connect(deployer).rely(interaction.address);
    await vat.connect(deployer).rely(dog.address);
    await vat.connect(deployer).rely(clip.address);
    await vat.connect(deployer)["file(bytes32,uint256)"](toBytes32("Line"), toRad("2000000")); // Normalized USB
    await vat
      .connect(deployer)
      ["file(bytes32,bytes32,uint256)"](collateral, toBytes32("line"), toRad("2000000"));
    await vat
      .connect(deployer)
      ["file(bytes32,bytes32,uint256)"](collateral, toBytes32("dust"), toRad("1"));
  };

  const configureSpot = async () => {
    await spot
      .connect(deployer)
      ["file(bytes32,bytes32,address)"](collateral, toBytes32("pip"), oracle.address);
    await spot
      .connect(deployer)
      ["file(bytes32,bytes32,uint256)"](
        collateral,
        toBytes32("mat"),
        "1250000000000000000000000000"
      ); // Liquidation Ratio
    await spot.connect(deployer)["file(bytes32,uint256)"](toBytes32("par"), toRay("1")); // It means pegged to 1$
    await spot.connect(deployer).poke(collateral);
  };

  const configureUSB = async () => {
    // Initialize Usb Module
    await usb.connect(deployer).rely(usbJoin.address);
  };

  const configureDog = async () => {
    await dog.connect(deployer).rely(clip.address);
    await dog.connect(deployer)["file(bytes32,address)"](toBytes32("vow"), vow.address);
    await dog.connect(deployer)["file(bytes32,uint256)"](toBytes32("Hole"), toRad("10000000"));
    await dog
      .connect(deployer)
      ["file(bytes32,bytes32,uint256)"](collateral, toBytes32("chop"), toWad("1.13"));
    await dog
      .connect(deployer)
      ["file(bytes32,bytes32,uint256)"](collateral, toBytes32("hole"), toRad("10000000"));
    await dog
      .connect(deployer)
      ["file(bytes32,bytes32,address)"](collateral, toBytes32("clip"), clip.address);
  };

  const configureClippers = async () => {
    await clip.connect(deployer).rely(dog.address);
    await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("buf"), toRay("1.2"));
    await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("tail"), "1800");
    await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("cusp"), toRay("0.3"));
    await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("chip"), toWad("0.02"));
    await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("tip"), toRad("100"));

    await clip.connect(deployer)["file(bytes32,address)"](toBytes32("vow"), vow.address);
    await clip.connect(deployer)["file(bytes32,address)"](toBytes32("calc"), abacus.address);
  };

  const configureVow = async () => {
    await vow.connect(deployer).rely(dog.address);
  };

  const configureJug = async () => {
    const BR = BigNumber.from("1000000003022266000000000000");
    await jug.connect(deployer)["file(bytes32,uint256)"](toBytes32("base"), BR); // 1% Yearly

    const proxyLike = await (
      await (await ethers.getContractFactory("ProxyLike"))
        .connect(deployer)
        .deploy(jug.address, vat.address)
    ).deployed();
    await jug.connect(deployer).rely(proxyLike.address);
    await proxyLike.connect(deployer).jugInitFile(collateral, toBytes32("duty"), "0");

    await jug.connect(deployer)["file(bytes32,address)"](toBytes32("vow"), vow.address);
  };

  const configureHelioToken = async () => {
    await helioToken.rely(rewards.address);
  };

  const configureHelioRewards = async () => {
    await rewards.setHelioToken(helioToken.address);
    await rewards.initPool(abnbc.address, collateral, "1000000001847694957439350500"); //6%
    await rewards.connect(deployer).rely(interaction.address);
  };

  const configureAuctionProxy = async () => {
    await auctionProxy.setDao(interaction.address);
  };

  const configureInteraction = async () => {
    await interaction
      .connect(deployer)
      .setCollateralType(abnbc.address, abnbcJoin.address, collateral, clip.address);
  };

  before("setup", async () => {
    [deployer, signer1, signer2, signer3] = await ethers.getSigners();

    await deployContracts();

    await configureAbacus();
    await configureOracles();
    await configureVat();
    await configureSpot();
    await configureUSB();
    await configureDog();
    await configureClippers();
    await configureVow();
    await configureJug();
    await configureHelioToken();
    await configureHelioRewards();
    await configureAuctionProxy();
    await configureInteraction();

    await networkSnapshotter.snapshot();
  });

  afterEach("back to the snapshot", async () => await networkSnapshotter.revert());

  describe("should revert if caller is not dao", () => {
    it("startAuction", async () => {
      await expect(
        auctionProxy.startAuction(
          signer1.address,
          signer2.address,
          usb.address,
          usbJoin.address,
          vat.address,
          dog.address,
          ethers.constants.AddressZero,
          {
            gem: abnbcJoin.address,
            ilk: collateral,
            live: 1,
            clip: clip.address,
          }
        )
      ).to.eventually.be.rejectedWith(Error, "Only dao contract can call");
    });

    it("buyFromAuction", async () => {
      await expect(
        auctionProxy.buyFromAuction(
          signer1.address,
          1,
          10000000,
          100000000,
          signer2.address,
          usb.address,
          usbJoin.address,
          vat.address,
          ethers.constants.AddressZero,
          {
            gem: abnbcJoin.address,
            ilk: collateral,
            live: 1,
            clip: clip.address,
          }
        )
      ).to.eventually.be.rejectedWith(Error, "Only dao contract can call");
    });
  });

  describe("revert cases", () => {
    it("cannot start auction if not needed", async () => {
      await expect(
        interaction.startAuction(abnbc.address, signer1.address, deployer.address)
      ).to.eventually.be.rejectedWith(Error, "Dog/not-unsafe");
    });

    it("cannot buy from auction if user has not enough balance", async () => {
      const auctionId = 1;
      await expect(
        interaction.buyFromAuction(
          abnbc.address,
          auctionId,
          toWad("7"),
          toWad("100"),
          signer2.address
        )
      ).to.eventually.be.rejectedWith(Error, "Usb/insufficient-balance");
    });

    it("cannot buy from auction if user has not approved to AuctionProxy address", async () => {
      await abnbc.connect(deployer).mint(signer1.address, toWad("10000"));
      const dink1 = toWad("10");
      await abnbc.connect(signer1).approve(interaction.address, dink1);
      await interaction.connect(signer1).deposit(signer1.address, abnbc.address, dink1);
      const dart1 = toWad("1000");
      await interaction.connect(signer1).borrow(abnbc.address, dart1);

      const auctionId = 1;
      await expect(
        interaction
          .connect(signer1)
          .buyFromAuction(abnbc.address, auctionId, toWad("7"), toWad("100"), signer2.address)
      ).to.eventually.be.rejectedWith(Error, "Usb/insufficient-allowance");
    });

    it("cannot buy from non existing auction", async () => {
      await abnbc.connect(deployer).mint(signer1.address, toWad("10000"));

      const dink1 = toWad("10");
      await abnbc.connect(signer1).approve(interaction.address, dink1);
      await interaction.connect(signer1).deposit(signer1.address, abnbc.address, dink1);

      const dart1 = toWad("1000");
      await interaction.connect(signer1).borrow(abnbc.address, dart1);

      await usb.connect(signer1).approve(auctionProxy.address, toWad("700"));

      const auctionId = 1;
      await expect(
        interaction
          .connect(signer1)
          .buyFromAuction(abnbc.address, auctionId, toWad("7"), toWad("100"), signer2.address)
      ).to.eventually.be.rejectedWith(Error, "Clipper/not-running-auction");
    });

    it("cannot buy if auction already ended", async () => {
      await abnbc.connect(deployer).mint(signer1.address, toWad("10000"));
      await abnbc.connect(deployer).mint(signer2.address, toWad("10000"));
      await abnbc.connect(deployer).mint(signer3.address, toWad("10000"));

      const dink1 = toWad("10");
      const dink2 = toWad("1000");
      const dink3 = toWad("1000");
      await abnbc.connect(signer1).approve(interaction.address, dink1);
      await abnbc.connect(signer2).approve(interaction.address, dink2);
      await abnbc.connect(signer3).approve(interaction.address, dink3);
      await interaction.connect(signer1).deposit(signer1.address, abnbc.address, dink1);
      await interaction.connect(signer2).deposit(signer2.address, abnbc.address, dink2);
      await interaction.connect(signer3).deposit(signer3.address, abnbc.address, dink3);

      const dart1 = toWad("1000");
      const dart2 = toWad("5000");
      const dart3 = toWad("5000");
      await interaction.connect(signer1).borrow(abnbc.address, dart1);
      await interaction.connect(signer2).borrow(abnbc.address, dart2);
      await interaction.connect(signer3).borrow(abnbc.address, dart3);

      await oracle.connect(deployer).setPrice(toWad("124"));
      await spot.connect(deployer).poke(collateral);

      const auctionId = BigNumber.from(1);

      let res = await interaction
        .connect(deployer)
        .startAuction(abnbc.address, signer1.address, deployer.address);
      expect(res).to.emit(clip, "Kick");

      await vat.connect(signer2).hope(clip.address);
      await vat.connect(signer3).hope(clip.address);

      await usb.connect(signer2).approve(auctionProxy.address, toWad("10000000000"));
      await usb.connect(signer3).approve(auctionProxy.address, toWad("10000000000"));

      await advanceTime(1000);

      await interaction
        .connect(signer2)
        .buyFromAuction(abnbc.address, auctionId, toWad("7"), toWad("100"), signer2.address);

      await interaction
        .connect(signer3)
        .buyFromAuction(abnbc.address, auctionId, toWad("5"), toWad("100"), signer3.address);

      const sale = await clip.sales(auctionId);
      expect(sale.pos).to.equal(0);
      expect(sale.tab).to.equal(0);
      expect(sale.lot).to.equal(0);
      expect(sale.tic).to.equal(0);
      expect(sale.top).to.equal(0);
      expect(sale.usr).to.equal(ethers.constants.AddressZero);

      await expect(
        interaction
          .connect(signer2)
          .buyFromAuction(abnbc.address, auctionId, toWad("7"), toWad("100"), signer2.address)
      ).to.eventually.be.rejectedWith(Error, "Clipper/not-running-auction");
    });
  });

  describe("good cases", () => {
    describe("without helioProvider", () => {
      it("auction started as expected", async () => {
        await abnbc.connect(deployer).mint(signer1.address, toWad("10000"));
        // Approve and send some collateral inside. collateral value == 400 == `dink`
        const dink = toWad("10");

        await abnbc.connect(signer1).approve(interaction.address, dink);
        // Deposit collateral(aBNBc) to the interaction contract
        await interaction.connect(signer1).deposit(signer1.address, abnbc.address, dink);
        const dart = toWad("1000");
        await interaction.connect(signer1).borrow(abnbc.address, dart);

        const usbBalanceBefore = await usb.balanceOf(deployer.address);

        // change collateral price
        await oracle.connect(deployer).setPrice(toWad("124"));
        await spot.connect(deployer).poke(collateral);
        await interaction
          .connect(deployer)
          .startAuction(abnbc.address, signer1.address, deployer.address);

        const sale = await clip.sales(1);
        expect(sale.usr).to.not.be.equal(ethers.constants.AddressZero);

        const usbBalanceAfter = await usb.balanceOf(deployer.address);
        const tip = await clip.tip();
        expect(usbBalanceAfter.gte(usbBalanceBefore.add(tip.div(ray)))).to.be.true;
      });

      it("auction works as expected", async () => {
        await abnbc.connect(deployer).mint(signer1.address, toWad("10000"));
        await abnbc.connect(deployer).mint(signer2.address, toWad("10000"));
        await abnbc.connect(deployer).mint(signer3.address, toWad("10000"));

        const dink1 = toWad("10");
        const dink2 = toWad("1000");
        const dink3 = toWad("1000");
        await abnbc.connect(signer1).approve(interaction.address, dink1);
        await abnbc.connect(signer2).approve(interaction.address, dink2);
        await abnbc.connect(signer3).approve(interaction.address, dink3);
        await interaction.connect(signer1).deposit(signer1.address, abnbc.address, dink1);
        await interaction.connect(signer2).deposit(signer2.address, abnbc.address, dink2);
        await interaction.connect(signer3).deposit(signer3.address, abnbc.address, dink3);

        const dart1 = toWad("1000");
        const dart2 = toWad("5000");
        const dart3 = toWad("5000");
        await interaction.connect(signer1).borrow(abnbc.address, dart1);
        await interaction.connect(signer2).borrow(abnbc.address, dart2);
        await interaction.connect(signer3).borrow(abnbc.address, dart3);

        await oracle.connect(deployer).setPrice(toWad("124"));
        await spot.connect(deployer).poke(collateral);

        const auctionId = BigNumber.from(1);

        let res = await interaction
          .connect(deployer)
          .startAuction(abnbc.address, signer1.address, deployer.address);
        expect(res).to.emit(clip, "Kick");

        await vat.connect(signer2).hope(clip.address);
        await vat.connect(signer3).hope(clip.address);

        await usb.connect(signer2).approve(auctionProxy.address, toWad("70000000000"));
        await usb.connect(signer3).approve(auctionProxy.address, toWad("70000000000"));

        await advanceTime(1000);

        const abnbcSigner2BalanceBefore = await abnbc.balanceOf(signer2.address);
        const abnbcSigner3BalanceBefore = await abnbc.balanceOf(signer3.address);

        await interaction
          .connect(signer2)
          .buyFromAuction(abnbc.address, auctionId, toWad("7"), toWad("100"), signer2.address);

        await interaction
          .connect(signer3)
          .buyFromAuction(abnbc.address, auctionId, toWad("7"), toWad("100"), signer3.address);

        const abnbcSigner2BalanceAfter = await abnbc.balanceOf(signer2.address);
        const abnbcSigner3BalanceAfter = await abnbc.balanceOf(signer3.address);

        expect(abnbcSigner2BalanceAfter.sub(abnbcSigner2BalanceBefore)).to.be.equal(toWad("7"));
        expect(abnbcSigner3BalanceAfter.sub(abnbcSigner3BalanceBefore)).to.be.equal(toWad("3"));

        const sale = await clip.sales(auctionId);
        expect(sale.pos).to.equal(0);
        expect(sale.tab).to.equal(0);
        expect(sale.lot).to.equal(0);
        expect(sale.tic).to.equal(0);
        expect(sale.top).to.equal(0);
        expect(sale.usr).to.equal(ethers.constants.AddressZero);
      });
    });

    xdescribe("with helioProvider", () => {
      const collateral2 = toBytes32("ceaBNBc");

      let helioProvider: MockHelioProvider;
      let ceaBNBc: MockERC20;
      let hBNB: MockERC20;
      // let ceaBNBcJoin: GemJoin;
      let oracle2: Oracle;

      beforeEach("setup for helioProvider", async () => {
        const HelioProvider = await ethers.getContractFactory("MockHelioProvider");
        const CeaBNBc = await ethers.getContractFactory("MockERC20");
        const HBNB = await ethers.getContractFactory("MockERC20");
        const Clipper = await ethers.getContractFactory("Clipper");
        const GemJoin = await ethers.getContractFactory("GemJoin");
        const Oracle = await ethers.getContractFactory("Oracle"); // Mock Oracle

        ceaBNBc = await CeaBNBc.deploy("ceaBNBc", "ceaBNBc");
        await ceaBNBc.deployed();
        const ceaBNBcJoin = await GemJoin.connect(deployer).deploy(
          vat.address,
          collateral2,
          ceaBNBc.address
        );
        await ceaBNBcJoin.deployed();
        hBNB = await HBNB.deploy("HBNB", "hBNB");
        await hBNB.deployed();
        helioProvider = await HelioProvider.deploy(
          hBNB.address,
          ceaBNBc.address,
          interaction.address
        );
        await helioProvider.deployed();
        oracle2 = await Oracle.connect(deployer).deploy();
        await oracle2.deployed();
        clip = await Clipper.connect(deployer).deploy(
          vat.address,
          spot.address,
          dog.address,
          collateral2
        );
        await clip.deployed();
        // configure vat
        await vat.connect(deployer).rely(clip.address);
        await vat
          .connect(deployer)
          ["file(bytes32,bytes32,uint256)"](collateral2, toBytes32("line"), toRad("2000000"));
        await vat
          .connect(deployer)
          ["file(bytes32,bytes32,uint256)"](collateral2, toBytes32("dust"), toRad("1"));
        // configure dog
        await dog.connect(deployer).rely(clip.address);
        await dog
          .connect(deployer)
          ["file(bytes32,bytes32,address)"](collateral2, toBytes32("clip"), clip.address);
        await dog
          .connect(deployer)
          ["file(bytes32,bytes32,uint256)"](collateral2, toBytes32("chop"), toWad("1.13"));
        await dog
          .connect(deployer)
          ["file(bytes32,bytes32,uint256)"](collateral2, toBytes32("hole"), toRad("10000000"));
        await dog
          .connect(deployer)
          ["file(bytes32,bytes32,address)"](collateral2, toBytes32("clip"), clip.address);

        // configure clip
        await clip.connect(deployer).rely(dog.address);
        await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("buf"), toRay("1.2"));
        await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("tail"), "1800");
        await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("cusp"), toRay("0.3"));
        await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("chip"), toWad("0.02"));
        await clip.connect(deployer)["file(bytes32,uint256)"](toBytes32("tip"), toRad("100"));

        await clip.connect(deployer)["file(bytes32,address)"](toBytes32("vow"), vow.address);
        await clip.connect(deployer)["file(bytes32,address)"](toBytes32("calc"), abacus.address);

        // configure helio rewards
        await rewards.initPool(ceaBNBc.address, collateral2, "1000000001847694957439350500"); //6%

        // configure oracle
        const collateral2Price = toWad("400");
        await oracle2.connect(deployer).setPrice(collateral2Price);

        // configure spot
        await spot
          .connect(deployer)
          ["file(bytes32,bytes32,address)"](collateral2, toBytes32("pip"), oracle2.address);
        await spot
          .connect(deployer)
          ["file(bytes32,bytes32,uint256)"](
            collateral2,
            toBytes32("mat"),
            "1250000000000000000000000000"
          ); // Liquidation Ratio
        await spot.connect(deployer).poke(collateral2);

        // configure jug
        const proxyLike = await (
          await (await ethers.getContractFactory("ProxyLike"))
            .connect(deployer)
            .deploy(jug.address, vat.address)
        ).deployed();
        await jug.connect(deployer).rely(proxyLike.address);
        await proxyLike.connect(deployer).jugInitFile(collateral, toBytes32("duty"), "0");

        // configure interaction
        await interaction
          .connect(deployer)
          .setCollateralType(ceaBNBc.address, ceaBNBcJoin.address, collateral2, clip.address);
        await interaction
          .connect(deployer)
          .setHelioProvider(ceaBNBc.address, helioProvider.address);
      });

      it("auction started as expected", async () => {
        const dink = toWad("10");

        await helioProvider.connect(signer1).depositBNB({ value: dink });

        const dart = toWad("1000");
        await interaction.connect(signer1).borrow(ceaBNBc.address, dart);

        const usbBalanceBefore = await usb.balanceOf(deployer.address);

        // change collateral price
        await oracle2.connect(deployer).setPrice(toWad("124"));
        await spot.connect(deployer).poke(collateral2);
        await interaction
          .connect(deployer)
          .startAuction(ceaBNBc.address, signer1.address, deployer.address);

        const sale = await clip.sales(1);
        expect(sale.usr).to.not.be.equal(ethers.constants.AddressZero);

        const hBNBBalance = await hBNB.balanceOf(signer1.address);
        expect(hBNBBalance.eq(0)).to.be.true;

        const usbBalanceAfter = await usb.balanceOf(deployer.address);
        const tip = await clip.tip();
        expect(usbBalanceAfter.gte(usbBalanceBefore.add(tip.div(ray)))).to.be.true;
      });

      it("auction works as expected", async () => {
        const dink1 = toWad("10");
        const dink2 = toWad("1000");
        const dink3 = toWad("1000");
        await helioProvider.connect(signer1).depositBNB({ value: dink1 });
        await helioProvider.connect(signer2).depositBNB({ value: dink2 });
        await helioProvider.connect(signer3).depositBNB({ value: dink3 });

        const dart1 = toWad("1000");
        const dart2 = toWad("10000");
        const dart3 = toWad("10000");
        await interaction.connect(signer1).borrow(ceaBNBc.address, dart1);
        await interaction.connect(signer2).borrow(ceaBNBc.address, dart2);
        await interaction.connect(signer3).borrow(ceaBNBc.address, dart3);

        await oracle2.connect(deployer).setPrice(toWad("124"));
        await spot.connect(deployer).poke(collateral2);

        const auctionId = BigNumber.from(1);

        let res = await interaction
          .connect(deployer)
          .startAuction(ceaBNBc.address, signer1.address, deployer.address);
        expect(res).to.emit(clip, "Kick");

        await vat.connect(signer2).hope(clip.address);
        await vat.connect(signer3).hope(clip.address);

        await usb.connect(signer2).approve(auctionProxy.address, toWad("70000000000"));
        await usb.connect(signer3).approve(auctionProxy.address, toWad("70000000000"));

        await advanceTime(1000);

        const ceaBNBcSigner2BalanceBefore = await ceaBNBc.balanceOf(signer2.address);
        const ceaBNBcSigner3BalanceBefore = await ceaBNBc.balanceOf(signer3.address);

        await interaction
          .connect(signer2)
          .buyFromAuction(ceaBNBc.address, auctionId, toWad("7"), toWad("100"), signer2.address);

        await interaction
          .connect(signer3)
          .buyFromAuction(ceaBNBc.address, auctionId, toWad("7"), toWad("100"), signer3.address);

        const ceaBNBcSigner2BalanceAfter = await ceaBNBc.balanceOf(signer2.address);
        const ceaBNBcSigner3BalanceAfter = await ceaBNBc.balanceOf(signer3.address);

        expect(ceaBNBcSigner2BalanceAfter.sub(ceaBNBcSigner2BalanceBefore)).to.be.equal(toWad("7"));
        expect(ceaBNBcSigner3BalanceAfter.sub(ceaBNBcSigner3BalanceBefore)).to.be.equal(toWad("3"));

        const sale = await clip.sales(auctionId);
        expect(sale.pos).to.equal(0);
        expect(sale.tab).to.equal(0);
        expect(sale.lot).to.equal(0);
        expect(sale.tic).to.equal(0);
        expect(sale.top).to.equal(0);
        expect(sale.usr).to.equal(ethers.constants.AddressZero);
      });
    });
  });
});
