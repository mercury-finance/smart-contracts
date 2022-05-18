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
} from "../../../common";

export interface VatLikeInterface extends utils.Interface {
  functions: {
    "heal(uint256)": FunctionFragment;
    "hope(address)": FunctionFragment;
    "move(address,address,uint256)": FunctionFragment;
    "nope(address)": FunctionFragment;
    "sin(address)": FunctionFragment;
    "usb(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "heal" | "hope" | "move" | "nope" | "sin" | "usb"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "heal", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "hope", values: [string]): string;
  encodeFunctionData(
    functionFragment: "move",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "nope", values: [string]): string;
  encodeFunctionData(functionFragment: "sin", values: [string]): string;
  encodeFunctionData(functionFragment: "usb", values: [string]): string;

  decodeFunctionResult(functionFragment: "heal", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hope", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "move", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nope", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sin", data: BytesLike): Result;
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
    heal(
      arg0: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    move(
      src: string,
      dst: string,
      rad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    nope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sin(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    usb(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  heal(
    arg0: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hope(
    arg0: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  move(
    src: string,
    dst: string,
    rad: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  nope(
    arg0: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sin(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  usb(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    heal(arg0: BigNumberish, overrides?: CallOverrides): Promise<void>;

    hope(arg0: string, overrides?: CallOverrides): Promise<void>;

    move(
      src: string,
      dst: string,
      rad: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    nope(arg0: string, overrides?: CallOverrides): Promise<void>;

    sin(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    usb(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    heal(
      arg0: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    move(
      src: string,
      dst: string,
      rad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    nope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sin(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    usb(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    heal(
      arg0: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    move(
      src: string,
      dst: string,
      rad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    nope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sin(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    usb(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
