/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  Jug,
  JugInterface,
} from "../../../../contracts/makerdaoCore/jug.sol/Jug";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "vat_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
        internalType: "address",
        name: "usr",
        type: "address",
      },
    ],
    name: "deny",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "rate",
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
        name: "ilk",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "data",
        type: "uint256",
      },
    ],
    name: "file",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "data",
        type: "uint256",
      },
    ],
    name: "file",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "data",
        type: "address",
      },
    ],
    name: "file",
    outputs: [],
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
        name: "duty",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rho",
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
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
    ],
    name: "rely",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vat",
    outputs: [
      {
        internalType: "contract VatLike",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vow",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "wards",
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

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516109f13803806109f183398101604081905261002f91610067565b33600090815260208190526040902060019055600280546001600160a01b0319166001600160a01b0392909216919091179055610097565b60006020828403121561007957600080fd5b81516001600160a01b038116811461009057600080fd5b9392505050565b61094b806100a66000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c8063626cb3c511610071578063626cb3c51461014e57806365fae35e146101615780639c52a7f114610174578063bf353dbb14610187578063d4e8be83146101a7578063d9638d36146101ba57600080fd5b80631a0b287e146100b957806329ae8114146100ce57806336569e77146100e15780633b6631951461011157806344e2a5a8146101245780635001f3b514610145575b600080fd5b6100cc6100c73660046107b9565b6101f6565b005b6100cc6100dc3660046107e5565b6102f1565b6002546100f4906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100cc61011f366004610807565b610334565b610137610132366004610807565b6103d0565b604051908152602001610108565b61013760045481565b6003546100f4906001600160a01b031681565b6100cc61016f36600461083c565b610599565b6100cc61018236600461083c565b6105e5565b61013761019536600461083c565b60006020819052908152604090205481565b6100cc6101b536600461085e565b61062e565b6101e16101c8366004610807565b6001602081905260009182526040909120805491015482565b60408051928352602083019190915201610108565b3360009081526020819052604090205460011461022e5760405162461bcd60e51b81526004016102259061088a565b60405180910390fd5b6000838152600160208190526040909120015442146102855760405162461bcd60e51b8152602060048201526013602482015272129d59cbdc9a1bcb5b9bdd0b5d5c19185d1959606a1b6044820152606401610225565b81636475747960e01b036102a9576000838152600160205260409020819055505050565b60405162461bcd60e51b815260206004820152601b60248201527f4a75672f66696c652d756e7265636f676e697a65642d706172616d00000000006044820152606401610225565b336000908152602081905260409020546001146103205760405162461bcd60e51b81526004016102259061088a565b81636261736560e01b036102a95760045550565b336000908152602081905260409020546001146103635760405162461bcd60e51b81526004016102259061088a565b60008181526001602052604090208054156103b75760405162461bcd60e51b8152602060048201526014602482015273129d59cbda5b1acb585b1c9958591e4b5a5b9a5d60621b6044820152606401610225565b6b033b2e3c9fd0803ce800000081554260019091015550565b6000818152600160208190526040822001544210156104235760405162461bcd60e51b815260206004820152600f60248201526e4a75672f696e76616c69642d6e6f7760881b6044820152606401610225565b600254604051636cb1c69b60e11b8152600481018490526000916001600160a01b03169063d9638d369060240160408051808303816000875af115801561046e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061049291906108b6565b6004546000868152600160205260409020549193506104ef92506104e9916104ba919061068b565b600086815260016020819052604090912001546104d790426108da565b6b033b2e3c9fd0803ce80000006106a1565b8261075f565b6002546003549193506001600160a01b039081169163b65337df91869116610517868661079b565b6040516001600160e01b031960e086901b16815260048101939093526001600160a01b0390911660248301526044820152606401600060405180830381600087803b15801561056557600080fd5b505af1158015610579573d6000803e3d6000fd5b505050600093845250506001602081905260409092204292019190915590565b336000908152602081905260409020546001146105c85760405162461bcd60e51b81526004016102259061088a565b6001600160a01b0316600090815260208190526040902060019055565b336000908152602081905260409020546001146106145760405162461bcd60e51b81526004016102259061088a565b6001600160a01b0316600090815260208190526040812055565b3360009081526020819052604090205460011461065d5760405162461bcd60e51b81526004016102259061088a565b8162766f7760e81b036102a957600380546001600160a01b0383166001600160a01b03199091161790555050565b8181018281101561069b57600080fd5b92915050565b6000838015610741576001841680156106bc578592506106c0565b8392505b50600283046002850494505b841561073b5785860286878204146106e357600080fd5b818101818110156106f357600080fd5b859004965050600185161561073057858302838782041415871515161561071957600080fd5b8181018181101561072957600080fd5b8590049350505b6002850494506106cc565b50610757565b8380156107515760009250610755565b8392505b505b509392505050565b81810281158061077d57508282828161077a5761077a6108ff565b04145b61078657600080fd5b6b033b2e3c9fd0803ce8000000900492915050565b808203600083128015906107b0575060008212155b61069b57600080fd5b6000806000606084860312156107ce57600080fd5b505081359360208301359350604090920135919050565b600080604083850312156107f857600080fd5b50508035926020909101359150565b60006020828403121561081957600080fd5b5035919050565b80356001600160a01b038116811461083757600080fd5b919050565b60006020828403121561084e57600080fd5b61085782610820565b9392505050565b6000806040838503121561087157600080fd5b8235915061088160208401610820565b90509250929050565b602080825260129082015271129d59cbdb9bdd0b585d5d1a1bdc9a5e995960721b604082015260600190565b600080604083850312156108c957600080fd5b505080516020909101519092909150565b6000828210156108fa57634e487b7160e01b600052601160045260246000fd5b500390565b634e487b7160e01b600052601260045260246000fdfea2646970667358221220be3db21dc1c7983693c5724f55f57c54886db604378d321a81b7904bf86efec364736f6c634300080d0033";

type JugConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: JugConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Jug__factory extends ContractFactory {
  constructor(...args: JugConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    vat_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Jug> {
    return super.deploy(vat_, overrides || {}) as Promise<Jug>;
  }
  override getDeployTransaction(
    vat_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(vat_, overrides || {});
  }
  override attach(address: string): Jug {
    return super.attach(address) as Jug;
  }
  override connect(signer: Signer): Jug__factory {
    return super.connect(signer) as Jug__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): JugInterface {
    return new utils.Interface(_abi) as JugInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Jug {
    return new Contract(address, _abi, signerOrProvider) as Jug;
  }
}
