/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  DSTokenLike,
  DSTokenLikeInterface,
} from "../../../../contracts/makerdaoCore/join.sol/DSTokenLike";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class DSTokenLike__factory {
  static readonly abi = _abi;
  static createInterface(): DSTokenLikeInterface {
    return new utils.Interface(_abi) as DSTokenLikeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DSTokenLike {
    return new Contract(address, _abi, signerOrProvider) as DSTokenLike;
  }
}
