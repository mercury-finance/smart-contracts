import { ethers } from "hardhat";
import { toWad } from "./utils";

import {
  ABNBC,
  INTERACTION,
  ORACLE,
  SPOT,
  VAT,
  CLIP,
  USB,
} from "./addresses.json";

const { BigNumber } = ethers;

const main = async () => {
  const collateral = ethers.utils.formatBytes32String("aBNBc");

  // const [deployer, signer1, signer2, signer3] = await ethers.getSigners();
  const [
    deployer,
    signer1,
    signer2,
    signer3,
    signer4,
    signer5,
    signer6,
    buyer,
  ] = await ethers.getSigners();

  const abnbc = await ethers.getContractAt("aBNBc", ABNBC);
  const interaction = await ethers.getContractAt("DAOInteraction", INTERACTION);
  const oracle = await ethers.getContractAt("Oracle", ORACLE);
  const spot = await ethers.getContractAt("Spotter", SPOT);
  const vat = await ethers.getContractAt("Vat", VAT);
  const clip = await ethers.getContractAt("Clipper", CLIP);
  const usb = await ethers.getContractAt("Usb", USB);

  await oracle.connect(deployer).setPrice(toWad("500"));
  await spot.connect(deployer).poke(collateral);

  await abnbc.connect(deployer).mint(signer1.address, toWad("10000"));
  await abnbc.connect(deployer).mint(signer2.address, toWad("10000"));
  await abnbc.connect(deployer).mint(signer3.address, toWad("10000"));
  await abnbc.connect(deployer).mint(signer4.address, toWad("10000"));
  await abnbc.connect(deployer).mint(signer5.address, toWad("10000"));
  await abnbc.connect(deployer).mint(signer6.address, toWad("10000"));
  await abnbc.connect(deployer).mint(buyer.address, toWad("10000"));

  const dink1 = toWad("1");
  const dink2 = toWad("1000");
  const dink3 = toWad("1000");
  const dink4 = toWad("1");
  const dink5 = toWad("1000");
  const dink6 = toWad("1000");
  const dinkBuyer = toWad("1000");
  await abnbc.connect(signer1).approve(interaction.address, dink1);
  await abnbc.connect(signer2).approve(interaction.address, dink2);
  await abnbc.connect(signer3).approve(interaction.address, dink3);
  await abnbc.connect(signer4).approve(interaction.address, dink4);
  await abnbc.connect(signer5).approve(interaction.address, dink5);
  await abnbc.connect(signer6).approve(interaction.address, dink6);
  await abnbc.connect(buyer).approve(interaction.address, dinkBuyer);
  await interaction
    .connect(signer1)
    .deposit(signer1.address, abnbc.address, dink1);
  await interaction
    .connect(signer2)
    .deposit(signer2.address, abnbc.address, dink2);
  await interaction
    .connect(signer3)
    .deposit(signer3.address, abnbc.address, dink3);
  await interaction
    .connect(signer4)
    .deposit(signer4.address, abnbc.address, dink4);
  await interaction
    .connect(signer5)
    .deposit(signer5.address, abnbc.address, dink5);
  await interaction
    .connect(signer6)
    .deposit(signer6.address, abnbc.address, dink6);
  await interaction
    .connect(buyer)
    .deposit(buyer.address, abnbc.address, dink6);

  const dart1 = toWad("400");
  const dart2 = toWad("5000");
  const dart3 = toWad("5000");
  const dart4 = toWad("400");
  const dart5 = toWad("5000");
  const dart6 = toWad("5000");
  const dartBuyer = toWad("5000");
  await interaction
    .connect(signer1)
    .borrow(signer1.address, abnbc.address, dart1);
  await interaction
    .connect(signer2)
    .borrow(signer2.address, abnbc.address, dart2);
  await interaction
    .connect(signer3)
    .borrow(signer3.address, abnbc.address, dart3);
  await interaction
    .connect(signer4)
    .borrow(signer4.address, abnbc.address, dart4);
  await interaction
    .connect(signer5)
    .borrow(signer5.address, abnbc.address, dart5);
  await interaction
    .connect(signer6)
    .borrow(signer6.address, abnbc.address, dart6);
  await interaction
    .connect(buyer)
    .borrow(buyer.address, abnbc.address, dartBuyer);

  await oracle.connect(deployer).setPrice(toWad("124"));
  await spot.connect(deployer).poke(collateral);

  console.log("start auction 1");
  await interaction
    .connect(deployer)
    .startAuction(abnbc.address, signer1.address, deployer.address);
  console.log("start auction 2");
  await interaction
    .connect(deployer)
    .startAuction(abnbc.address, signer4.address, deployer.address);

  // const auctionId = BigNumber.from(1);

  // await vat.connect(signer2).hope(clip.address);
  // await vat.connect(signer3).hope(clip.address);

  // await usb.connect(signer2).approve(interaction.address, toWad("700"));
  // await usb.connect(signer3).approve(interaction.address, toWad("700"));
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
