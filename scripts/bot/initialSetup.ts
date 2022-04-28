import { ethers, upgrades } from "hardhat";
import { toWad, toRay, toRad } from "./utils";
import fs from "fs";

const BigNumber = ethers.BigNumber;
const toBytes32 = ethers.utils.formatBytes32String;

const main = async () => {
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

  const collateral = toBytes32("aBNBc");

  // Abacus
  const abacus = await LinearDecrease.connect(deployer).deploy();
  await abacus.deployed();
  console.log("abacus      ->", abacus.address);

  // Core module
  const vat = await Vat.connect(deployer).deploy();
  await vat.deployed();
  console.log("vat         ->", vat.address);
  const spot = await Spot.connect(deployer).deploy(vat.address);
  await spot.deployed();
  console.log("spot        ->", spot.address);

  // Usb module
  const usb = await Usb.connect(deployer).deploy(97);
  await usb.deployed(); // Stable Coin
  console.log("usb         ->", usb.address);
  const usbJoin = await UsbJoin.connect(deployer).deploy(
    vat.address,
    usb.address
  );
  await usbJoin.deployed();
  console.log("usbJoin     ->", usbJoin.address);

  // Collateral module
  const abnbc = await ABNBC.connect(deployer).deploy();
  await abnbc.deployed(); // Collateral
  console.log("abnbc       ->", abnbc.address);
  const abnbcJoin = await GemJoin.connect(deployer).deploy(
    vat.address,
    collateral,
    abnbc.address
  );
  await abnbcJoin.deployed();
  console.log("abnbcJoin   ->", abnbcJoin.address);

  // Rates module
  const jug = await Jug.connect(deployer).deploy(vat.address);
  await jug.deployed();
  console.log("jug         ->", jug.address);

  // External
  const oracle = await Oracle.connect(deployer).deploy();
  await oracle.deployed();
  console.log("oracle      ->", oracle.address);

  // Auction modules
  const dog = await Dog.connect(deployer).deploy(vat.address);
  await dog.deployed();
  console.log("dog         ->", dog.address);

  const clip = await Clipper.connect(deployer).deploy(
    vat.address,
    spot.address,
    dog.address,
    collateral
  );
  await clip.deployed();
  console.log("clip        ->", clip.address);

  // vow
  const vow = await Vow.connect(deployer).deploy(
    vat.address,
    ethers.constants.AddressZero,
    ethers.constants.AddressZero
  );
  await vow.deployed();
  console.log("vow         ->", vow.address);

  const interaction = await upgrades.deployProxy(DAOInteraction, [
    vat.address,
    spot.address,
    usb.address,
    usbJoin.address,
    jug.address,
    dog.address,
  ]);
  console.log("interaction ->", interaction.address);

  // configure abacus
  await abacus.connect(deployer).file(toBytes32("tau"), "1800");

  // configure oracle
  const collateral1Price = toWad("400");
  await oracle.connect(deployer).setPrice(collateral1Price);

  // configure vat
  await vat.connect(deployer).rely(usbJoin.address);
  await vat.connect(deployer).rely(spot.address);
  await vat.connect(deployer).rely(jug.address);
  await vat.connect(deployer).rely(interaction.address);
  await vat.connect(deployer).rely(dog.address);
  await vat.connect(deployer).rely(clip.address);
  await vat
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("Line"), toRad("20000")); // Normalized USB
  await vat
    .connect(deployer)
    ["file(bytes32,bytes32,uint256)"](
      collateral,
      toBytes32("line"),
      toRad("20000")
    );
  await vat
    .connect(deployer)
    ["file(bytes32,bytes32,uint256)"](
      collateral,
      toBytes32("dust"),
      toRad("1")
    );

  // configure vow
  await vow.connect(deployer).rely(dog.address);

  // configure spot
  await spot
    .connect(deployer)
    ["file(bytes32,bytes32,address)"](
      collateral,
      toBytes32("pip"),
      oracle.address
    );
  await spot
    .connect(deployer)
    ["file(bytes32,bytes32,uint256)"](
      collateral,
      toBytes32("mat"),
      "1250000000000000000000000000"
    ); // Liquidation Ratio
  await spot
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("par"), toRay("1")); // It means pegged to 1$
  await spot.connect(deployer).poke(collateral);

  // configure usb
  await usb.connect(deployer).rely(usbJoin.address);

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

  // configure clip
  await clip.connect(deployer).rely(dog.address);
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("buf"), toRay("1.2"));
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("tail"), "1800");
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("cusp"), toRay("0.3"));
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("chip"), toWad("0.02"));
  await clip
    .connect(deployer)
    ["file(bytes32,uint256)"](toBytes32("tip"), toRad("100"));

  await clip
    .connect(deployer)
    ["file(bytes32,address)"](toBytes32("vow"), vow.address);
  await clip
    .connect(deployer)
    ["file(bytes32,address)"](toBytes32("calc"), abacus.address);

  // configure jug
  const BR = BigNumber.from("1000000003022266000000000000");
  await jug.connect(deployer)["file(bytes32,uint256)"](toBytes32("base"), BR); // 1% Yearly

  const proxyLike = await (
    await (await ethers.getContractFactory("ProxyLike"))
      .connect(deployer)
      .deploy(jug.address, vat.address)
  ).deployed();
  await jug.connect(deployer).rely(proxyLike.address);
  await proxyLike
    .connect(deployer)
    .jugInitFile(collateral, toBytes32("duty"), "0");

  await jug
    .connect(deployer)
    ["file(bytes32,address)"](toBytes32("vow"), vow.address);

  // configure interaction
  await interaction
    .connect(deployer)
    .setCollateralType(
      abnbc.address,
      abnbcJoin.address,
      collateral,
      clip.address
    );

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
  };

  const jsonAddresses = JSON.stringify(addresses);
  fs.writeFileSync("./scripts/bot/addresses.json", jsonAddresses);
  console.log("Addresses saved!");
};

main()
  .then(() => {
    console.log("Success!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
