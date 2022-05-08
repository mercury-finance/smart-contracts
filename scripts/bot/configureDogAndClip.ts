import hre, { ethers, upgrades } from "hardhat";
import fs from "fs";

import { toRad, toRay, toWad } from "./utils";

const { BigNumber } = ethers;
const toBytes32 = ethers.utils.formatBytes32String;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const VAT = "0x2aD101ddFdF7db7EDE1fF41a6D4299d01365f08a";
const SPOT = "0x617c086cA4a0AD213d9104258014cE49D02AF5FB";
const aBNBc = "0x33284aFc0791F18011B86C2469A7625066345373";
const USB = "0x86A6bdb0101051a0F5FeeD0941055Bca74F21D6C";
const UsbJoin = "0x1bBc63CFd9998dd2f493d96AeBE3ED4F4dB4Ce3e";
const aBNBcJoin = "0xCA1bB2B8Fec377FB2802745a5Bfe0c57c82A178a";
const INTERACTION = "0xA2bDF14E2662d98E456B9124F39a5DfF6218D18a";
const Oracle = "0x12e4142ACa8bf5a73B2CeE27C5901325Cd86fD0d";
const REAL_ABNBC = "0x46dE2FBAf41499f298457cD2d9288df4Eb1452Ab";
const REALaBNBcJoin = "0xa1935C363162EccBb45FF3478Cf21FfaFc863b0D";
const REALOracle = "0x76c2f516E814bC6B785Dfe466760346a5aa7bbD1";
const JUG = "0xaf978deF81B194810ae6519d7A1BECb53C6fe76D";
const VOW = "0x7F6e9C365aA9C44cF72575257700698f4D460711";
const FLOP = "0xF277566891E6171be86C6799B35cbBeaDdE0d9B4";
const FLAP = "0xbe53EAfA0a6BB91576a51B401A7Ba70338516ebc";
const JAR = "0xc538aCeF4975af32accf67C255B88B12Eebb3924";
const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const DOG = "0xAb8b59F2574a1167BD12AE5760B9Ba960f253049";
const CLIP1 = "0xe851187810DBBfC9c2417cE7c45007EbADE401A2";
const CLIP2 = "0xD0E98F68439Da121FbcD19AAAFd16D6b51ff3F6c";
const ceBNBc = "0xCa33FBAb46a05D7f8e3151975543a3a1f7463F63";
const REWARDS = "0x7ad1585f12742D21BBDD0e3Ed8DdE279B55565e3";
const HELIO_TOKEN = "0x97BBBc81eBF1F130315b717b165Ebc9193a046Cd";
const ABACUS = "0x5584c13C4B0e5AEC276311C421Ee983242B610DB";

const main = async () => {
  console.log("network name is ->", hre.network.name);
  const collateral = toBytes32("aBNBc");
  const [deployer] = await ethers.getSigners();

  const vat = await ethers.getContractAt("Vat", VAT);
  const spot = await ethers.getContractAt("Spotter", SPOT);
  const usb = await ethers.getContractAt("Usb", USB);
  const abnbc = await ethers.getContractAt("aBNBc", aBNBc);
  const abnbcJoin = await ethers.getContractAt("GemJoin", aBNBcJoin);
  const usbJoin = await ethers.getContractAt("UsbJoin", UsbJoin);
  const jug = await ethers.getContractAt("Jug", JUG);
  const oracle = await ethers.getContractAt("Oracle", Oracle); // Mock Oracle
  const dog = await ethers.getContractAt("Dog", DOG);
  const clip = await ethers.getContractAt("Clipper", CLIP1);
  const abacus = await ethers.getContractAt("LinearDecrease", ABACUS);
  const vow = await ethers.getContractAt("Vow", VOW);
  const interaction = await ethers.getContractAt("DAOInteraction", INTERACTION);
  const flap = await ethers.getContractAt("Flapper", FLAP);
  const flop = await ethers.getContractAt("Flopper", FLOP);
  const jar = await ethers.getContractAt("Jar", JAR);
  const helioRewards = await ethers.getContractAt("HelioRewards", REWARDS);
  const helioToken = await ethers.getContractAt("HelioToken", HELIO_TOKEN);

  // await dog.connect(deployer).rely(clip.address);
  // await dog
  //   .connect(deployer)
  //   ["file(bytes32,address)"](toBytes32("vow"), vow.address);
  // await dog
  //   .connect(deployer)
  //   ["file(bytes32,uint256)"](toBytes32("Hole"), toRad("10000000"));
  // await dog
  //   .connect(deployer)
  //   ["file(bytes32,bytes32,uint256)"](
  //     collateral,
  //     toBytes32("chop"),
  //     toWad("1.13")
  //   );
  // await dog
  //   .connect(deployer)
  //   ["file(bytes32,bytes32,uint256)"](
  //     collateral,
  //     toBytes32("hole"),
  //     toRad("10000000")
  //   );
  // await dog
  //   .connect(deployer)
  //   ["file(bytes32,bytes32,address)"](
  //     collateral,
  //     toBytes32("clip"),
  //     clip.address
  //   );
  // console.log("dog config completed");

  // // configure clip
  // await clip.connect(deployer).rely(dog.address);
  // await clip
  //   .connect(deployer)
  //   ["file(bytes32,uint256)"](toBytes32("buf"), toRay("1.01"));
  // await clip
  //   .connect(deployer)
  //   ["file(bytes32,uint256)"](toBytes32("tail"), "3600");
  // await clip
  //   .connect(deployer)
  //   ["file(bytes32,uint256)"](toBytes32("cusp"), toRay("0.1"));
  // await clip
  //   .connect(deployer)
  //   ["file(bytes32,uint256)"](toBytes32("chip"), toWad("0.01"));
  // await clip
  //   .connect(deployer)
  //   ["file(bytes32,uint256)"](toBytes32("tip"), toRad("1"));

  // await clip
  //   .connect(deployer)
  //   ["file(bytes32,address)"](toBytes32("vow"), vow.address);
  // await clip
  //   .connect(deployer)
  //   ["file(bytes32,address)"](toBytes32("calc"), abacus.address);
  // console.log("clip config completed");

  // // configure vow
  // await vow.connect(deployer).rely(dog.address);
  // await vow.connect(deployer).rely(flop.address);
  // console.log("vow config completed");

  // configure vat
  await vat.connect(deployer).rely(dog.address);
  await vat.connect(deployer).rely(clip.address);
  console.log("vat config completed");
};

main()
  .then(() => {
    console.log("Success!");
  })
  .catch((err) => {
    console.log(err);
  });
