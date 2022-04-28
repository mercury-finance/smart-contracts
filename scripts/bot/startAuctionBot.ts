import { Contract } from "ethers/lib/ethers";
import { ethers } from "hardhat";
import { SPOT, DOG } from "./addresses.json";

const CLIP_ABI = require("../../artifacts/contracts/clip.sol/Clipper.json").abi;
const SPOT_ABI = require("../../artifacts/contracts/spot.sol/Spotter.json").abi;
const DOG_ABI = require("../../artifacts/contracts/dog.sol/Dog.json").abi;

// const CLIPPER_ADDRESSES = [CLIP];
const USER_ADDRESSES = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
  "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
  "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
  "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
  "0x976ea74026e726554db657fa54763abd0c3a0aa9",
];

const wsProvider = new ethers.providers.WebSocketProvider(
  "http://localhost:8545"
);

const main = async () => {
  const [deployer, signer1, signer2, signer3] = await ethers.getSigners();
  const spot = new ethers.Contract(SPOT, SPOT_ABI, deployer);
  const dog = new ethers.Contract(DOG, DOG_ABI, deployer);
  spot.on("Poke", (ilk, val, spot) => {
    console.log("Poke event triggered");
    dog.ilks(ilk).then((ilkObj: any) => {
      const clip = new ethers.Contract(ilkObj.clip, CLIP_ABI, deployer);
    });
  });
};

main();
