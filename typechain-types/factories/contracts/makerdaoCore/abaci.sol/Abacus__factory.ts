/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  Abacus,
  AbacusInterface,
} from "../../../../contracts/makerdaoCore/abaci.sol/Abacus";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "price",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class Abacus__factory {
  static readonly abi = _abi;
  static createInterface(): AbacusInterface {
    return new utils.Interface(_abi) as AbacusInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Abacus {
    return new Contract(address, _abi, signerOrProvider) as Abacus;
  }
}
