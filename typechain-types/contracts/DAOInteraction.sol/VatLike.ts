/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../common";

export interface VatLikeInterface extends utils.Interface {
  functions: {
    "behalf(address,address)": FunctionFragment;
    "flux(bytes32,address,address,uint256)": FunctionFragment;
    "frob(bytes32,address,address,address,int256,int256)": FunctionFragment;
    "gem(bytes32,address)": FunctionFragment;
    "hope(address)": FunctionFragment;
    "ilks(bytes32)": FunctionFragment;
    "init(bytes32)": FunctionFragment;
    "move(address,address,uint256)": FunctionFragment;
    "rely(address)": FunctionFragment;
    "urns(bytes32,address)": FunctionFragment;
    "usb(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "behalf"
      | "flux"
      | "frob"
      | "gem"
      | "hope"
      | "ilks"
      | "init"
      | "move"
      | "rely"
      | "urns"
      | "usb"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "behalf",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "flux",
    values: [BytesLike, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "frob",
    values: [BytesLike, string, string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "gem",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "hope", values: [string]): string;
  encodeFunctionData(functionFragment: "ilks", values: [BytesLike]): string;
  encodeFunctionData(functionFragment: "init", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "move",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "rely", values: [string]): string;
  encodeFunctionData(
    functionFragment: "urns",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "usb", values: [string]): string;

  decodeFunctionResult(functionFragment: "behalf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "flux", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "frob", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hope", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ilks", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "move", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rely", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "urns", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "usb", data: BytesLike): Result;

  events: {};
}

export interface VatLike extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VatLikeInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    behalf(
      bit: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    flux(
      ilk: BytesLike,
      src: string,
      dst: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    frob(
      i: BytesLike,
      u: string,
      v: string,
      w: string,
      dink: BigNumberish,
      dart: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    gem(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    hope(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ilks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>;

    init(
      ilk: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    move(
      src: string,
      dst: string,
      rad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    urns(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    usb(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  behalf(
    bit: string,
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  flux(
    ilk: BytesLike,
    src: string,
    dst: string,
    wad: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  frob(
    i: BytesLike,
    u: string,
    v: string,
    w: string,
    dink: BigNumberish,
    dart: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  gem(
    arg0: BytesLike,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  hope(
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ilks(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>;

  init(
    ilk: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  move(
    src: string,
    dst: string,
    rad: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rely(
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  urns(
    arg0: BytesLike,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  usb(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    behalf(bit: string, usr: string, overrides?: CallOverrides): Promise<void>;

    flux(
      ilk: BytesLike,
      src: string,
      dst: string,
      wad: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    frob(
      i: BytesLike,
      u: string,
      v: string,
      w: string,
      dink: BigNumberish,
      dart: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    gem(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hope(usr: string, overrides?: CallOverrides): Promise<void>;

    ilks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>;

    init(ilk: BytesLike, overrides?: CallOverrides): Promise<void>;

    move(
      src: string,
      dst: string,
      rad: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    rely(usr: string, overrides?: CallOverrides): Promise<void>;

    urns(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    usb(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    behalf(
      bit: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    flux(
      ilk: BytesLike,
      src: string,
      dst: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    frob(
      i: BytesLike,
      u: string,
      v: string,
      w: string,
      dink: BigNumberish,
      dart: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    gem(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hope(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ilks(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    init(
      ilk: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    move(
      src: string,
      dst: string,
      rad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    urns(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    usb(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    behalf(
      bit: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    flux(
      ilk: BytesLike,
      src: string,
      dst: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    frob(
      i: BytesLike,
      u: string,
      v: string,
      w: string,
      dink: BigNumberish,
      dart: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    gem(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hope(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ilks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    init(
      ilk: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    move(
      src: string,
      dst: string,
      rad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    urns(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    usb(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
