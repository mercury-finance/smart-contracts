import { ethers, BigNumber } from "ethers";
import { SPOT, DOG, INTERACTION, USB, ABNBC } from "./addresses.json";

const toBytes32 = ethers.utils.formatBytes32String;

const CLIP_ABI = require("../../artifacts/contracts/clip.sol/Clipper.json").abi;
const SPOT_ABI = require("../../artifacts/contracts/spot.sol/Spotter.json").abi;
const DOG_ABI = require("../../artifacts/contracts/dog.sol/Dog.json").abi;
const INTERACTION_ABI =
  require("../../artifacts/contracts/DAOInteraction.sol/DAOInteraction.json").abi;
const ORACLE_ABI =
  require("../../artifacts/contracts/mock/oracle.sol/Oracle.json").abi;
const USB_ABI = require("../../artifacts/contracts/usb.sol/Usb.json").abi;
const ABACUS_ABI =
  require("../../artifacts/contracts/abaci.sol/Abacus.json").abi;

interface Auction {
  id: BigNumber;
  clip: ethers.Contract;
  oracle: ethers.Contract;
  abacus: ethers.Contract;
}
const tokenAddress = ABNBC;
const collateral = toBytes32("aBNBc");

const ten = BigNumber.from(10);
const wad = ten.pow(18);
const ray = ten.pow(27);
const rad = ten.pow(45);

const PROVIDER_URL = process.env.PROVIDER_URL as string;
// const PROVIDER_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";

const wsProvider = new ethers.providers.WebSocketProvider(PROVIDER_URL);
const SENDER_PK = process.env.BUYER_PRIVATE_KEY as string;
const wallet = new ethers.Wallet(SENDER_PK, wsProvider);

const spotContract = new ethers.Contract(SPOT, SPOT_ABI, wallet);
const dog = new ethers.Contract(DOG, DOG_ABI, wallet);
const interaction = new ethers.Contract(INTERACTION, INTERACTION_ABI, wallet);
const usb = new ethers.Contract(USB, USB_ABI, wallet);

const auctions = new Map<number, Auction>();

const gasLimit = BigNumber.from("500000");
const pricePercent = BigNumber.from("95");
const interval = 3000;

let pendingTxExist = false;

setInterval(() => {
  console.log("Trying!");
  for (const [idNum, auction] of auctions) {
    console.log("auction id is ->", auction.id.toString());
    const { id, clip, oracle } = auction;
    Promise.all([
      clip.getStatus(id),
      oracle.peek(),
      usb.balanceOf(wallet.address),
    ]).then(
      ([status, peekRes, botBalance]: [
        status: Array<any>,
        peekRes: Array<any>,
        botBalance: BigNumber
      ]) => {
        botBalance = BigNumber.from(botBalance);
        const actualPrice = BigNumber.from(peekRes[0]);
        const needsRedo: boolean = status[0];
        const auctionPrice = BigNumber.from(status[1]).div(10 ** 9);
        const lot = BigNumber.from(status[2]);
        console.log("Actual price is: ", actualPrice.toString());
        console.log("Auction price is:", auctionPrice.toString());
        console.log("Needs redos:     ", needsRedo);
        console.log("lot is:          ", lot.toString());
        console.log("pending tx exist:", pendingTxExist);

        if (
          !needsRedo &&
          !lot.isZero() &&
          !pendingTxExist &&
          actualPrice.mul(pricePercent).div(100).gte(auctionPrice)
        ) {
          pendingTxExist = true;
          const maxCollateralAmount = botBalance.mul(wad).div(auctionPrice);
          const collateralAmount = maxCollateralAmount.gt(lot)
            ? lot
            : maxCollateralAmount;
          console.log("Starting buy");
          auctions.delete(idNum);
          interaction
            .buyFromAuction(
              tokenAddress,
              id,
              collateralAmount,
              auctionPrice.mul(10 ** 9),
              wallet.address,
              { gasLimit }
            )
            .then((tx: ethers.providers.TransactionResponse) => {
              console.log("Transaction sended");
              return tx.wait();
            })
            .then((tx: ethers.providers.TransactionReceipt) => {
              pendingTxExist = false;
              console.log("Transaction hash is:", tx.transactionHash);
            });
        } else if (needsRedo || lot.isZero()) {
          console.log("removing auction");
          auctions.delete(idNum);
        }
      }
    );
  }
}, interval);

const main = async () => {
  Promise.all([
    spotContract.ilks(collateral),
    dog.ilks(collateral),
    usb.allowance(wallet.address, interaction.address),
  ]).then(
    ([spotIlk, dogIlk, allowance]: [
      spotIlk: Array<any>,
      dogIlk: Array<any>,
      allowance: BigNumber
    ]) => {
      allowance = BigNumber.from(allowance);
      const oracle = new ethers.Contract(spotIlk[0], ORACLE_ABI, wallet);
      const clip = new ethers.Contract(dogIlk[0], CLIP_ABI, wallet);
      clip.calc().then((abacusAddress: string) => {
        const abacus = new ethers.Contract(abacusAddress, ABACUS_ABI, wallet);
        if (allowance.lt(ethers.constants.MaxUint256)) {
          usb
            .approve(interaction.address, ethers.constants.MaxUint256)
            .then(() => {
              console.log("successful approve");
            });
        } else {
          console.log("no need of approve");
        }
        clip.on("Kick", (id, top, tab, lot, usr, kpr, coin) => {
          console.log(`Auction with id ${id.toString()} started`);

          if (!auctions.has(id.toNumber())) {
            auctions.set(id.toNumber(), {
              id: BigNumber.from(id),
              clip,
              oracle,
              abacus,
            });
          }
        });
      });
    }
  );
};

main();
