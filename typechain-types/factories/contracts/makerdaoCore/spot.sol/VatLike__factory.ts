/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  VatLike,
  VatLikeInterface,
} from "../../../../contracts/makerdaoCore/spot.sol/VatLike";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "file",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class VatLike__factory {
  static readonly abi = _abi;
  static createInterface(): VatLikeInterface {
    return new utils.Interface(_abi) as VatLikeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VatLike {
    return new Contract(address, _abi, signerOrProvider) as VatLike;
  }
}
