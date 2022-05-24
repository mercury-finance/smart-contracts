import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";

const hoursToSeconds = (hours: BigNumber): BigNumber => {
  return hours.mul(60).mul(60);
};

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log('deployer is ->', deployer.address);
  const networkName = network.name;
  let factory;
  if (networkName === "bsc") {
    factory = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
  } else if (networkName === "bsc_testnet") {
    factory = "0xb7926c0430afb07aa7defde6da862ae0bde767bc";
  } else {
    console.error("Invalid network");
    process.exit(1);
  }

  const windowSize = hoursToSeconds(BigNumber.from("6"));
  const granularity = BigNumber.from("6");

  const PancakeOracle = await ethers.getContractFactory("SlidingWindowOracle");
  const pancakeOracle = await PancakeOracle.deploy(factory, windowSize, granularity);
  await pancakeOracle.deployed();

  console.log("pancake oracle was deployed ot address", pancakeOracle.address);
};

main();
