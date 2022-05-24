import { ethers } from "hardhat";

const useBNBPath = false;
const token = ethers.constants.AddressZero;
const pancakeOracle = ethers.constants.AddressZero;
const spotAddress = ethers.constants.AddressZero;
const ilk = ethers.utils.formatBytes32String("ilk");

const main = async () => {
  const Oracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await Oracle.deploy(token, pancakeOracle, useBNBPath);
  await oracle.deployed();

  const spot = await ethers.getContractAt("Spotter", spotAddress);
  const what = ethers.utils.formatBytes32String("pip");
  await spot["file(bytes32,bytes32,address)"](ilk, what, oracle.address);

  console.log("oracle was deployed on address ->", oracle.address);
};

main();
