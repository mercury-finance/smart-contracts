import { ethers, network } from "hardhat";

export const advanceTime = async (seconds: number | string) => {
  await network.provider.send("evm_increaseTime", [seconds]);
  await network.provider.send("evm_mine");
};

export const toWad = (num: string) => {
  return ethers.utils.parseUnits(num, 18);
};

export const toRay = (num: string) => {
  return ethers.utils.parseUnits(num, 27);
};

export const toRad = (num: string) => {
  return ethers.utils.parseUnits(num, 45);
};

export const printSale = (sale: any) => {
  // uint256 pos;  // Index in active array
  // uint256 tab;  // Usb to raise       [rad]
  // uint256 lot;  // collateral to sell [wad]
  // address usr;  // Liquidated CDP
  // uint96  tic;  // Auction start time
  // uint256 top;  // Starting price     [ray]
  console.log("pos ->", sale.pos.toString());
  console.log("tab ->", sale.tab.toString());
  console.log("lot ->", sale.lot.toString());
  console.log("usr ->", sale.usr.toString());
  console.log("tic ->", sale.tic.toString());
  console.log("top ->", sale.top.toString());
};

export default {
  toWad,
  toRay,
  toRad,
  advanceTime,
  printSale,
};
