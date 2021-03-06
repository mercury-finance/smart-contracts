/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  HelioProviderLike,
  HelioProviderLikeInterface,
} from "../../../contracts/DAOInteraction.sol/HelioProviderLike";

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
    name: "daoBurn",
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
    name: "daoMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "liquidation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class HelioProviderLike__factory {
  static readonly abi = _abi;
  static createInterface(): HelioProviderLikeInterface {
    return new utils.Interface(_abi) as HelioProviderLikeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HelioProviderLike {
    return new Contract(address, _abi, signerOrProvider) as HelioProviderLike;
  }
}
