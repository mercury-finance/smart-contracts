import { BigNumber, ethers } from "ethers";

export const toWad = (num: string) => {
  return ethers.utils.parseUnits(num, 18);
};

export const toRay = (num: string) => {
  return ethers.utils.parseUnits(num, 27);
};

export const toRad = (num: string) => {
  return ethers.utils.parseUnits(num, 45);
};

const interactionAbi =
  require("../../artifacts/contracts/DAOInteraction.sol/DAOInteraction.json").abi;
const usbAbi = require("../../artifacts/contracts/usb.sol/Usb.json").abi;

const PROVIDER_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";

const INTERACTION_ABI = interactionAbi;
const USB_ABI = usbAbi;

const INTERACTION_ADDRESS = "0xE8A954826660a78FFf62652FeD243E3fef262014";
const USB_ADDRESS = "0x86A6bdb0101051a0F5FeeD0941055Bca74F21D6C";
const COLLATERAL1_ADDRESS = "0x33284aFc0791F18011B86C2469A7625066345373";

const AUCTION_ID = "1";
const COLLATERAL_AMOUNT = toWad("1");
const MAX_PRICE_PER_UNIT = toRay("100");
const RECEIVER_ADDRESS = "0x73CF7cC1778a60d43Ca2833F419B77a76177156A";
const SENDER_PK = "YOUR_PRIVATE_KEY";

const takeFromAuction = async () => {
  const provider = new ethers.providers.StaticJsonRpcProvider(PROVIDER_URL);
  const wallet = new ethers.Wallet(SENDER_PK, provider);
  const interaction = new ethers.Contract(
    INTERACTION_ADDRESS,
    INTERACTION_ABI,
    wallet
  );
  const usb = new ethers.Contract(USB_ADDRESS, USB_ABI, wallet);
  const amountToBeApproved = BigNumber.from(MAX_PRICE_PER_UNIT)
    .mul(BigNumber.from(COLLATERAL_AMOUNT))
    .div(BigNumber.from(toRay("1")));
  const allowance: BigNumber = await usb.allowance(
    wallet.address,
    interaction.address
  );
  if (allowance.lt(amountToBeApproved)) {
    console.log(
      `approving ${amountToBeApproved.toString()} amount to DAOInteraction address`
    );
    let res = await usb.approve(
      INTERACTION_ADDRESS,
      amountToBeApproved.toString()
    );
    res = await res.wait();
    console.log("approved. ts hash:", res.hash);
  }

  let res = await interaction.buyFromAuction(
    COLLATERAL1_ADDRESS,
    AUCTION_ID,
    COLLATERAL_AMOUNT,
    MAX_PRICE_PER_UNIT,
    RECEIVER_ADDRESS
  );
  res = await res.wait();
  console.log("Transaction ended with hash of ->", res.hash);
};

takeFromAuction();
