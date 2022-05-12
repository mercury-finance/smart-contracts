import hre, { ethers, upgrades } from "hardhat";
import fs from "fs";

import { toRad, toRay, toWad } from "./utils";

import {
  ABACUS,
  VAT,
  SPOT,
  USB,
  USB_JOIN,
  ABNBC,
  ABNBC_JOIN,
  JUG,
  ORACLE,
  CLIP,
  DOG,
  VOW,
  INTERACTION,
  FLAP,
  FLOP,
  JAR,
  HELIO_REWARDS,
  HELIO_TOKEN,
} from "./deployedAddresses.json";

const { BigNumber } = ethers;
const toBytes32 = ethers.utils.formatBytes32String;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  console.log("network name is ->", hre.network.name);
  const collateral = toBytes32("aBNBc");
  const [deployer] = await ethers.getSigners();
  const Vat = await ethers.getContractFactory("Vat");
  const Spot = await ethers.getContractFactory("Spotter");
  const Usb = await ethers.getContractFactory("Usb");
  const ABNBC = await ethers.getContractFactory("aBNBc");
  const GemJoin = await ethers.getContractFactory("GemJoin");
  const UsbJoin = await ethers.getContractFactory("UsbJoin");
  const Jug = await ethers.getContractFactory("Jug");
  const Oracle = await ethers.getContractFactory("Oracle"); // Mock Oracle
  const Dog = await ethers.getContractFactory("Dog");
  const Clipper = await ethers.getContractFactory("Clipper");
  const LinearDecrease = await ethers.getContractFactory("LinearDecrease");
  const Vow = await ethers.getContractFactory("Vow");
  const DAOInteraction = await ethers.getContractFactory("DAOInteraction");
  const Flap = await ethers.getContractFactory("Flapper");
  const Flop = await ethers.getContractFactory("Flopper");
  const Jar = await ethers.getContractFactory("Jar");
  const HelioRewards = await ethers.getContractFactory("HelioRewards");
  const HelioToken = await ethers.getContractFactory("HelioToken");

  // Abacus
  const abacus = await LinearDecrease.connect(deployer).deploy();
  await abacus.deployed();

  // Core module
  const vat = await Vat.connect(deployer).deploy();
  await vat.deployed();
  const spot = await Spot.connect(deployer).deploy(vat.address);
  await spot.deployed();

  // Usb module
  const usb = await Usb.connect(deployer).deploy(97);
  await usb.deployed(); // Stable Coin
  const usbJoin = await UsbJoin.connect(deployer).deploy(
    vat.address,
    usb.address
  );
  await usbJoin.deployed();

  // Collateral module
  const abnbc = await ABNBC.connect(deployer).deploy();
  await abnbc.deployed(); // Collateral
  const abnbcJoin = await GemJoin.connect(deployer).deploy(
    vat.address,
    collateral,
    abnbc.address
  );
  await abnbcJoin.deployed();

  // Rates module
  const jug = await Jug.connect(deployer).deploy(vat.address);
  await jug.deployed();

  // External
  const oracle = await Oracle.connect(deployer).deploy();
  await oracle.deployed();

  // Auction modules
  const dog = await Dog.connect(deployer).deploy(vat.address);
  await dog.deployed();
  const clip = await Clipper.connect(deployer).deploy(
    vat.address,
    spot.address,
    dog.address,
    collateral
  );
  await clip.deployed();

  const flap = await Flap.deploy(vat.address, abnbc.address);
  await flap.deployed();
  const flop = await Flop.deploy(vat.address, abnbc.address);
  await flop.deployed();

  // vow
  const vow = await Vow.connect(deployer).deploy(
    vat.address,
    flap.address,
    flop.address,
    "0xbcd4042de499d14e55001ccbb24a551f3b954096"
  );
  await vow.deployed();

  const jar = await Jar.connect(deployer).deploy(
    "Helio USB",
    "hUSB",
    vat.address,
    vow.address,
  );
  await jar.deployed();

  const helioRewards = await HelioRewards.deploy(vat.address);
  await helioRewards.deployed();
  const helioToken = await HelioToken.deploy();
  await helioToken.deployed();

  const interaction = await upgrades.deployProxy(DAOInteraction, [
    vat.address,
    spot.address,
    usb.address,
    usbJoin.address,
    jug.address,
    dog.address,
    helioRewards.address,
  ]);
  await interaction.deployed();
  console.log("deployments ended!");

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
    INTERACTION: interaction.address,
    FLAP: flap.address,
    FLOP: flop.address,
    JAR: jar.address,
    HELIO_REWARDS: helioRewards.address,
    HELIO_TOKEN: helioToken.address,
  };

  const jsonAddresses = JSON.stringify(addresses);
  if (hre.network.name === "bsc_testnet") {
    fs.writeFileSync("./scripts/bot/deployedAddresses.json", jsonAddresses);
  } else {
    fs.writeFileSync("./scripts/bot/addresses.json", jsonAddresses);
  }
  console.log("Addresses saved!");

  // configure abacus
  await abacus.connect(deployer).file(toBytes32("tau"), "3600");
  console.log("abacus config completed");

  // configure oracle
  const collateral1Price = toWad("500");
  await oracle.connect(deployer).setPrice(collateral1Price);
  console.log("oracle config completed");

  // configure vat
  await vat.connect(deployer).rely(usbJoin.address);
  await vat.connect(deployer).rely(spot.address);
  await vat.connect(deployer).rely(jug.address);
  await vat.connect(deployer).rely(interaction.address);
  await vat.connect(deployer).rely(dog.address);
  await vat.connect(deployer).rely(clip.address);
  await vat.connect(deployer).rely(flap.address);
  await vat.connect(deployer).rely(flop.address);
  await vat.connect(deployer).rely(jar.address);
  await vat
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("Line"), toRad("5000000")); // Normalized USB
  await vat
    .connect(deployer)
    ["file(bytes32,bytes32,uint256)"](
      collateral,
      toBytes32("line"),
      toRad("5000000")
    );
  await vat
    .connect(deployer)
    ["file(bytes32,bytes32,uint256)"](
      collateral,
      toBytes32("dust"),
      toRad("1")
    );
  console.log("vat config completed");

  // configure spot
  await spot
    .connect(deployer)
    ["file(bytes32,bytes32,address)"](
      collateral,
      toBytes32("pip"),
      oracle.address
    );

  console.log(1);

  await spot
    .connect(deployer)
    ["file(bytes32,bytes32,uint256)"](
      collateral,
      toBytes32("mat"),
      "1250000000000000000000000000"
    ); // Liquidation Ratio
  console.log(2);
  await spot
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("par"), toRay("1")); // It means pegged to 1$
  await spot.connect(deployer).poke(collateral);
  console.log("spot config completed");

  // configure usb
  await usb.connect(deployer).rely(usbJoin.address);
  console.log("usb config completed");

  // configure usbJoin
  await usbJoin.rely(jar.address);
  console.log("usbJoin config completed");

  // configure dog
  await dog.connect(deployer).rely(clip.address);
  await dog
    .connect(deployer)
    ["file(bytes32,address)"](toBytes32("vow"), vow.address);
  await dog
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("Hole"), toRad("10000000"));
  await dog
    .connect(deployer)
    ["file(bytes32,bytes32,uint256)"](
      collateral,
      toBytes32("chop"),
      toWad("1.13")
    );
  await dog
    .connect(deployer)
    ["file(bytes32,bytes32,uint256)"](
      collateral,
      toBytes32("hole"),
      toRad("10000000")
    );
  await dog
    .connect(deployer)
    ["file(bytes32,bytes32,address)"](
      collateral,
      toBytes32("clip"),
      clip.address
    );
  console.log("dog config completed");

  // configure clip
  await clip.connect(deployer).rely(dog.address);
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("buf"), toRay("1.01"));
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("tail"), "3600");
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("cusp"), toRay("0.1"));
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("chip"), toWad("0"));
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("tip"), toRad("1"));

  await clip
    .connect(deployer)
    ["file(bytes32,address)"](toBytes32("vow"), vow.address);
  await clip
    .connect(deployer)
    ["file(bytes32,address)"](toBytes32("calc"), abacus.address);
  console.log("clip config completed");

  // configure vow
  await vow.connect(deployer).rely(dog.address);
  await vow.connect(deployer).rely(flop.address);
  console.log("vow config completed");

  // configure helioReward
  await helioRewards.connect(deployer).rely(interaction.address);
  console.log("helioRewards config completed");

  // const vat = await ethers.getContractAt("Vat", VAT);
  // const spot = await ethers.getContractAt("Spotter", SPOT);
  // const usb = await ethers.getContractAt("Usb", USB);
  // const abnbc = await ethers.getContractAt("aBNBc", ABNBC);
  // const abnbcJoin = await ethers.getContractAt("GemJoin", ABNBC_JOIN);
  // const usbJoin = await ethers.getContractAt("UsbJoin", USB_JOIN);
  // const jug = await ethers.getContractAt("Jug", JUG);
  // // const oracle = await ethers.getContractAt("Oracle", ORACLE); // Mock Oracle
  // const dog = await ethers.getContractAt("Dog", DOG);
  // // const clip = await ethers.getContractAt("Clipper", CLIP);
  // const abacus = await ethers.getContractAt("LinearDecrease", ABACUS);
  // const vow = await ethers.getContractAt("Vow", VOW);
  // const interaction = await ethers.getContractAt("DAOInteraction", INTERACTION);
  // const flap = await ethers.getContractAt("Flapper", FLAP);
  // const flop = await ethers.getContractAt("Flopper", FLOP);
  // const jar = await ethers.getContractAt("Jar", JAR);
  // const helioRewards = await ethers.getContractAt(
  //   "HelioRewards",
  //   HELIO_REWARDS
  // );
  // const helioToken = await ethers.getContractAt("HelioToken", HELIO_TOKEN);

  // configure jug
  const BR = BigNumber.from("1000000003022266000000000000");
  await jug.connect(deployer)["file(bytes32,uint256)"](toBytes32("base"), BR); // 1% Yearly

  const proxyLike = await (
    await (await ethers.getContractFactory("ProxyLike"))
      .connect(deployer)
      .deploy(jug.address, vat.address)
  ).deployed();
  console.log("proxyLike address is ->", proxyLike.address);
  await jug.connect(deployer).rely(proxyLike.address);
  await proxyLike
    .connect(deployer)
    .jugInitFile(
      collateral,
      toBytes32("duty"),
      "0000000000312410000000000000",
      { gasLimit: 1000000 }
    );

  await jug
    .connect(deployer)
    ["file(bytes32,address)"](toBytes32("vow"), vow.address);

  console.log("jug config completed");

  await interaction
    .connect(deployer)
    .setCollateralType(
      abnbc.address,
      abnbcJoin.address,
      collateral,
      clip.address
    );
  console.log("interaction config completed");

  // console.log("verification started!");
  // let interactionImplAddress = await upgrades.erc1967.getImplementationAddress(
  //   interaction.address
  // );

  // await hre.run("verify:verify", {
  //   address: abacus.address,
  // });

  // await hre.run("verify:verify", {
  //   address: vat.address,
  // });

  // await hre.run("verify:verify", {
  //   address: spot.address,
  //   constructorArguments: [vat.address],
  // });

  // await hre.run("verify:verify", {
  //   address: usb.address,
  //   constructorArguments: [97],
  // });

  // await hre.run("verify:verify", {
  //   address: usbJoin.address,
  //   constructorArguments: [vat.address, usb.address],
  // });

  // await hre.run("verify:verify", {
  //   address: interactionImplAddress,
  // });

  // await hre.run("verify:verify", {
  //   address: abnbc.address,
  //   constructorArguments: [],
  // });

  // await hre.run("verify:verify", {
  //   address: abnbcJoin.address,
  //   constructorArguments: [vat.address, collateral, abnbc.address],
  // });

  // await hre.run("verify:verify", {
  //   address: jug.address,
  //   constructorArguments: [vat.address],
  // });

  // await hre.run("verify:verify", {
  //   address: oracle.address,
  // });

  // await hre.run("verify:verify", {
  //   address: dog.address,
  //   constructorArguments: [vat.address],
  // });

  // await hre.run("verify:verify", {
  //   address: clip.address,
  //   constructorArguments: [vat.address, spot.address, dog.address, collateral],
  // });

  // await hre.run("verify:verify", {
  //   address: flap.address,
  //   constructorArguments: [vat.address, abnbc.address],
  // });

  // await hre.run("verify:verify", {
  //   address: flop.address,
  //   constructorArguments: [vat.address, abnbc.address],
  // });

  // await hre.run("verify:verify", {
  //   address: vow.address,
  //   constructorArguments: [vat.address, flap.address, flop.address],
  // });

  // await hre.run("verify:verify", {
  //   address: jar.address,
  //   constructorArguments: [
  //     "Helio USB",
  //     "hUSB",
  //     vat.address,
  //     vow.address,
  //     usbJoin.address,
  //   ],
  // });

  // await hre.run("verify:verify", {
  //   address: helioRewards.address,
  //   constructorArguments: [vat.address],
  // });

  // await hre.run("verify:verify", {
  //   address: helioToken.address,
  //   constructorArguments: [],
  // });

  // console.log("verification ended");
};

main()
  .then(() => {
    console.log("Success!");
  })
  .catch((err) => {
    console.log(err);
  });
