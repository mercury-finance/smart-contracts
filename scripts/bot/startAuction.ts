import { ethers } from "ethers";

const abi =
  require("../../artifacts/contracts/DAOInteraction.sol/DAOInteraction.json").abi;
const vat_abi = require("../../artifacts/contracts/vat.sol/Vat.json").abi;

const PROVIDER_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";

const INTERACTION_ADDRESS = "0xE8A954826660a78FFf62652FeD243E3fef262014";
const COLLATERAL1_ADDRESS = "0x33284aFc0791F18011B86C2469A7625066345373";

const SENDER_PK =
  "0xa629dd55e7c55bc8bcc1383d3f13d1e0f7832602bc7972deef0da3ea62f11f93";
const INTERACTION_ABI = abi;
const USER_ADDRESS = "0x269EC56426ef36733599B14B345F1df6328a9EF0";
const KEEPER_ADDRESS = "0x73CF7cC1778a60d43Ca2833F419B77a76177156A";

const startAuction = async () => {
  const provider = new ethers.providers.StaticJsonRpcProvider(PROVIDER_URL);
  const wallet = new ethers.Wallet(SENDER_PK, provider);
  // const interaction = new ethers.Contract(
  //   INTERACTION_ADDRESS,
  //   INTERACTION_ABI,
  //   wallet
  // );
  // let res = await interaction.startAuction(COLLATERAL1_ADDRESS, USER_ADDRESS, KEEPER_ADDRESS);
  // res = await res.wait();
  // console.log("Transaction ended with hash of ->", res.hash);
  const vat = new ethers.Contract(
    "0x8ca8E83FCAaC89EfE36C5e200a137C8989a08a40",
    vat_abi,
    wallet
  );
  const a = await vat.urns(
    "0x61424e4263000000000000000000000000000000000000000000000000000000",
    "0x73CF7cC1778a60d43Ca2833F419B77a76177156A"
  );
  console.log(a[0].toString());
};

startAuction();
