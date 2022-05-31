import { ethers } from "hardhat";

const useBNBPath = true;
// const token = ethers.constants.AddressZero;
// const pancakeOracle = ethers.constants.AddressZero;
// const spotAddress = ethers.constants.AddressZero;
// const ilk = ethers.utils.formatBytes32String("ilk");

const token = "0x46dE2FBAf41499f298457cD2d9288df4Eb1452Ab";
const pancakeOracle = "0x732fd059A3645b5C676e48a03f9FbAAeb5Eed15c";
// const spotAddress = ethers.constants.AddressZero;
// const ilk = ethers.utils.formatBytes32String("ilk");

const main = async () => {
  const Oracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await Oracle.deploy(token, pancakeOracle, useBNBPath);
  await oracle.deployed();

  // const spot = await ethers.getContractAt("Spotter", spotAddress);
  // const what = ethers.utils.formatBytes32String("pip");
  // await spot["file(bytes32,bytes32,address)"](ilk, what, oracle.address);

  console.log("oracle was deployed on address ->", oracle.address);
};

main();
