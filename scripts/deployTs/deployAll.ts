import fs from "fs";
import { ethers, upgrades, network } from "hardhat";
import {
  ABNBc,
  ABNBc__factory,
  AuctionProxy,
  Clipper,
  DAOInteraction,
  Dog,
  Flapper,
  Flopper,
  GemJoin,
  HelioRewards,
  HelioToken,
  Jar,
  Jug,
  LinearDecrease,
  Oracle,
  Spotter,
  Usb,
  UsbJoin,
  Vat,
  Vow,
} from "../../typechain-types";
import { toWad, toRay, toRad } from "../../test/helpers/utils";
const BigNumber = ethers.BigNumber;
const toBytes32 = ethers.utils.formatBytes32String;

const main = async () => {
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
  let jar: Jar;
  let flap: Flapper;
  let flop: Flopper;

  const collateral = ethers.utils.formatBytes32String("aBNBc");
  const [deployer] = await ethers.getSigners();
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
    const Flap = await ethers.getContractFactory("Flapper");
    const Flop = await ethers.getContractFactory("Flopper");
    const Jar = await ethers.getContractFactory("Jar");

    // Abacus
    abacus = await LinearDecrease.connect(deployer).deploy();
    await abacus.deployed();

    // Core module
    vat = await Vat.connect(deployer).deploy();
    await vat.deployed();
    spot = await Spot.connect(deployer).deploy(vat.address);
    await spot.deployed();

    // Usb module
    usb = await Usb.connect(deployer).deploy(80001, "USB");
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

    flap = await Flap.deploy(vat.address, abnbc.address);
    await flap.deployed();
    flop = await Flop.deploy(vat.address, abnbc.address);
    await flop.deployed();

    // vow
    vow = await Vow.connect(deployer).deploy(
      vat.address,
      flap.address,
      flop.address,
      deployer.address
    );
    await vow.deployed();
    jar = await Jar.connect(deployer).deploy("Helio USB", "hUSB");
    await jar.deployed();
    // helioToken
    helioToken = await HelioToken.deploy();
    await helioToken.deployed();

    // helioRewards
    rewards = await HelioRewards.deploy(vat.address);
    await rewards.deployed();

    // auctionProxy
    auctionProxy = await AuctionProxy.deploy();
    await auctionProxy.deployed();

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
    const addresses = {
      ABACUS: abacus.address,
      VAT: vat.address,
      SPOT: spot.address,
      USB: usb.address,
      USB_JOIN: usbJoin.address,
      ABNBC: abnbc.address,
      ABNBC_JOIN: abnbcJoin.address,
      JUG: jug.address,
      ORACLE: oracle.address,
      CLIP: clip.address,
      DOG: dog.address,
      VOW: vow.address,
      AUCTION_PROXY: auctionProxy.address,
      INTERACTION: interaction.address,
      FLAP: flap.address,
      FLOP: flop.address,
      JAR: jar.address,
      HELIO_REWARDS: rewards.address,
      HELIO_TOKEN: helioToken.address,
    };

    const jsonAddresses = JSON.stringify(addresses);
    fs.writeFileSync(`./addresses/${network.name}-addresses.json`, jsonAddresses);
    console.log("Addresses saved!");
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
    await vat.connect(deployer).rely(jar.address);
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
    await usbJoin.rely(jar.address);
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
    const tx = await jug.connect(deployer).rely(proxyLike.address);
    await tx.wait();
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

  // abacus = await ethers.getContractAt(
  //   "LinearDecrease",
  //   "0x4800533dF79496bA39571c095050B4c277b97B43"
  // );
  // vat = await ethers.getContractAt("Vat", "0x6E9F279cCEc00a245535EDa5775a9Af96c4BadCC");
  // spot = await ethers.getContractAt("Spotter", "0x73256b30025de0d7CE2Ad814ec9E3A5719F371CA");
  // usb = await ethers.getContractAt("Usb", "0xc0d9AD4F76Aa38F1C27b66f972Ad300b281615B1");
  // abnbc = (await ethers.getContractAt(
  //   "aBNBc",
  //   "0x84238B93080ED03d84E5445486b1f4383AC8d3D5"
  // )) as ABNBc;
  // abnbcJoin = await ethers.getContractAt("GemJoin", "0x9659cE0fd43C02a81b6188d01A7318E1A4A0969a");
  // usbJoin = await ethers.getContractAt("UsbJoin", "0x6Bec5d377dC0a4c72095D208b240d4d8A6e263f2");
  // jug = await ethers.getContractAt("Jug", "0x2C7924bd50444EB34694591d169E5500A852DceA");
  // oracle = await ethers.getContractAt("Oracle", "0x4914aefD41288baC209EaC5D0Be96F8E337DE296");
  // clip = await ethers.getContractAt("Clipper", "0x1bAce88409CF6fF91F7772309A4c16F924395211");
  // dog = await ethers.getContractAt("Dog", "0x05f4AF9089202E214b81dd5406922B4B339D2B84");
  // vow = await ethers.getContractAt("Vow", "0x9fcc2170CB0627e352b77009dE1C3E6B60b94c28");
  // helioToken = await ethers.getContractAt(
  //   "HelioToken",
  //   "0x118C9773c38623ffeaeBf3BBCc2b7B54B8fb675A"
  // );
  // rewards = await ethers.getContractAt(
  //   "HelioRewards",
  //   "0x2269ebFf28F67D0cdc2F978A5c6952cB7b63cb7C"
  // );
  // auctionProxy = await ethers.getContractAt(
  //   "AuctionProxy",
  //   "0x1bdf9d3548cfbb0620484a89c2f3d40b06c51ea8"
  // );
  // interaction = await ethers.getContractAt(
  //   "DAOInteraction",
  //   "0xC8337E98c80Cb64151694CaFe18d8A9a2f974e16"
  // );
  // jar = await ethers.getContractAt("Jar", "0x32115C72f0ACe60E4A91D6805672EBa6a972fF40");
  // flap = await ethers.getContractAt("Flapper", "0x0d05049f0CC7FaE71D1e22BA2f56Ee09779D1EEA");
  // flop = await ethers.getContractAt("Flopper", "0x627BbC3fBfb1225E5aDDf21c7CBF003951FDCF03");

  await deployContracts();
  console.log("deployment config completed");

  await configureAbacus();
  console.log("abacus config completed");
  await configureOracles();
  console.log("oracle config completed");
  await configureVat();
  console.log("vat config completed");
  await configureSpot();
  console.log("spot config completed");
  await configureUSB();
  console.log("usb config completed");
  await configureDog();
  console.log("dog config completed");
  await configureClippers();
  console.log("clipper config completed");
  await configureVow();
  console.log("vow config completed");
  await configureJug();
  console.log("jug config completed");
  await configureHelioToken();
  console.log("helioToken config completed");
  await configureHelioRewards();
  console.log("helioRewards config completed");
  await configureAuctionProxy();
  console.log("auctionProxy config completed");
  await configureInteraction();
  console.log("Interaction config completed");
};

main();
