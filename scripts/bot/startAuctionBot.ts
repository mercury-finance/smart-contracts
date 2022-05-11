import { ethers, BigNumber } from "ethers";
import { SPOT, DOG, VAT, INTERACTION } from "./addresses.json";

const CLIP_ABI = require("../../artifacts/contracts/clip.sol/Clipper.json").abi;
const SPOT_ABI = require("../../artifacts/contracts/spot.sol/Spotter.json").abi;
const DOG_ABI = require("../../artifacts/contracts/dog.sol/Dog.json").abi;
const VAT_ABI = require("../../artifacts/contracts/vat.sol/Vat.json").abi;
const INTERACTION_ABI =
  require("../../artifacts/contracts/DAOInteraction.sol/DAOInteraction.json").abi;
const ORACLE_ABI =
  require("../../artifacts/contracts/mock/oracle.sol/Oracle.json").abi;

const ten = BigNumber.from(10);
const wad = ten.pow(18);
const ray = ten.pow(27);
const rad = ten.pow(45);

const PROVIDER_URL = "http://localhost:8545";

// const CLIPPER_ADDRESSES = [CLIP];
// const USER_ADDRESSES = [
//   "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
//   "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
//   "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
//   "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
//   "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
//   "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
//   "0x976ea74026e726554db657fa54763abd0c3a0aa9",
// ];
const wsProvider = new ethers.providers.WebSocketProvider(PROVIDER_URL);
const SENDER_PK = process.env.DEPLOYER_PRIVATE_KEY as string;
const wallet = new ethers.Wallet(SENDER_PK, wsProvider);

const min = (num1: BigNumber, num2: BigNumber): BigNumber => {
  return num1.lt(num2) ? num1 : num2;
};

const wmul = (num1: BigNumber, num2: BigNumber): BigNumber => {
  return num1.mul(num2).div(wad);
};

const toWad = (num: string) => {
  return ethers.utils.parseUnits(num, 18);
};

const main = async () => {
  const BNB_PRICE = BigNumber.from(toWad("300"));
  const GAS_LIMIT = BigNumber.from("500000");

  const spotContract = new ethers.Contract(SPOT, SPOT_ABI, wallet);
  const dog = new ethers.Contract(DOG, DOG_ABI, wallet);
  const vat = new ethers.Contract(VAT, VAT_ABI, wallet);
  const interaction = new ethers.Contract(INTERACTION, INTERACTION_ABI, wallet);
  spotContract.on("Poke", (ilk, val, spot) => {
    console.log("Poke event triggered");
    Promise.all([
      dog.Hole(),
      dog.Dirt(),
      dog.ilks(ilk),
      vat.ilks(ilk),
      interaction.getUsersInDebt(),
    ]).then(
      ([Hole, Dirt, dogIlk, vatIlk, userAddresses]: [
        Hole: BigNumber,
        Dirt: BigNumber,
        dogIlk: Array<any>,
        vatIlk: Array<any>,
        userAddresses: Array<string>
      ]) => {
        Hole = BigNumber.from(Hole);
        Dirt = BigNumber.from(Dirt);
        const clip = new ethers.Contract(dogIlk[0], CLIP_ABI, wallet);
        Promise.all([clip.tip(), clip.chip(), wsProvider.getGasPrice()]).then(
          ([tip, chip, gasPrice]: [
            tip: BigNumber,
            chip: BigNumber,
            gasPrice: BigNumber
          ]) => {
            tip = BigNumber.from(tip);
            chip = BigNumber.from(chip);
            for (const userAddress of userAddresses) {
              vat.urns(ilk, userAddress).then((urn: any) => {
                const ink = BigNumber.from(urn[0]);
                const art = BigNumber.from(urn[1]);
                const rate = BigNumber.from(vatIlk[1]);
                const spot = BigNumber.from(vatIlk[2]);
                const dust = BigNumber.from(vatIlk[4]);
                const chop = BigNumber.from(dogIlk[1]);

                if (!spot.isZero() && ink.mul(spot).lt(art.mul(rate))) {
                  // calculate tab
                  const room = min(
                    Hole.sub(Dirt),
                    BigNumber.from(dogIlk[2]).sub(BigNumber.from(dogIlk[3]))
                  );
                  let dart = min(art, room.mul(wad).div(rate).div(chop));
                  if (art.gt(dart) && art.sub(dart).mul(rate).lt(dust)) {
                    dart = art;
                  }
                  const due = dart.mul(rate);
                  const tab = due.mul(chop).div(wad);
                  // calculate USB incentives amount
                  const usbIncentiveAmount = tip.add(wmul(tab, chip)).div(ray);
                  // calculate transaction cost
                  const txCost = gasPrice
                    .mul(GAS_LIMIT)
                    .mul(BNB_PRICE)
                    .div(wad);
                  if (txCost.lt(usbIncentiveAmount)) {
                    console.log("Starting Auction!");
                    dog
                      .bark(ilk, userAddress, wallet.address, {
                        gasLimit: GAS_LIMIT,
                      })
                      .then((tx: ethers.providers.TransactionResponse) => {
                        console.log("Transaction sended");
                        return tx.wait();
                      })
                      .then((tx: ethers.providers.TransactionReceipt) => {
                        console.log("Transaction hash is:", tx.transactionHash);
                      });
                  }
                }
              });
            }
          }
        );
      }
    );
  });
};

main();
