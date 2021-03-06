/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  JugLike,
  JugLikeInterface,
} from "../../../contracts/DAOInteraction.sol/JugLike";

const _abi = [
  {
    inputs: [],
    name: "base",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "ilk",
        type: "bytes32",
      },
    ],
    name: "drip",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "ilks",
    outputs: [
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
    stateMutability: "view",
    type: "function",
  },
];

export class JugLike__factory {
  static readonly abi = _abi;
  static createInterface(): JugLikeInterface {
    return new utils.Interface(_abi) as JugLikeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): JugLike {
    return new Contract(address, _abi, signerOrProvider) as JugLike;
  }
}
