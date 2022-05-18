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

export type SaleStruct = {
  pos: BigNumberish;
  tab: BigNumberish;
  lot: BigNumberish;
  usr: string;
  tic: BigNumberish;
  top: BigNumberish;
};

export type SaleStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  BigNumber,
  BigNumber
] & {
  pos: BigNumber;
  tab: BigNumber;
  lot: BigNumber;
  usr: string;
  tic: BigNumber;
  top: BigNumber;
};

export interface ClipperLikeInterface extends utils.Interface {
  functions: {
    "count()": FunctionFragment;
    "ilk()": FunctionFragment;
    "kick(uint256,uint256,address,address)": FunctionFragment;
    "kicks()": FunctionFragment;
    "list()": FunctionFragment;
    "sales(uint256)": FunctionFragment;
    "take(uint256,uint256,uint256,address,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "count"
      | "ilk"
      | "kick"
      | "kicks"
      | "list"
      | "sales"
      | "take"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "count", values?: undefined): string;
  encodeFunctionData(functionFragment: "ilk", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "kick",
    values: [BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(functionFragment: "kicks", values?: undefined): string;
  encodeFunctionData(functionFragment: "list", values?: undefined): string;
  encodeFunctionData(functionFragment: "sales", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "take",
    values: [BigNumberish, BigNumberish, BigNumberish, string, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "count", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ilk", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "kick", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "kicks", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "list", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sales", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "take", data: BytesLike): Result;

  events: {};
}

export interface ClipperLike extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ClipperLikeInterface;

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
    count(overrides?: CallOverrides): Promise<[BigNumber]>;

    ilk(overrides?: CallOverrides): Promise<[string]>;

    kick(
      tab: BigNumberish,
      lot: BigNumberish,
      usr: string,
      kpr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    kicks(overrides?: CallOverrides): Promise<[BigNumber]>;

    list(overrides?: CallOverrides): Promise<[BigNumber[]]>;

    sales(
      auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[SaleStructOutput]>;

    take(
      id: BigNumberish,
      amt: BigNumberish,
      max: BigNumberish,
      who: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  count(overrides?: CallOverrides): Promise<BigNumber>;

  ilk(overrides?: CallOverrides): Promise<string>;

  kick(
    tab: BigNumberish,
    lot: BigNumberish,
    usr: string,
    kpr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  kicks(overrides?: CallOverrides): Promise<BigNumber>;

  list(overrides?: CallOverrides): Promise<BigNumber[]>;

  sales(
    auctionId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<SaleStructOutput>;

  take(
    id: BigNumberish,
    amt: BigNumberish,
    max: BigNumberish,
    who: string,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    count(overrides?: CallOverrides): Promise<BigNumber>;

    ilk(overrides?: CallOverrides): Promise<string>;

    kick(
      tab: BigNumberish,
      lot: BigNumberish,
      usr: string,
      kpr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    kicks(overrides?: CallOverrides): Promise<BigNumber>;

    list(overrides?: CallOverrides): Promise<BigNumber[]>;

    sales(
      auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<SaleStructOutput>;

    take(
      id: BigNumberish,
      amt: BigNumberish,
      max: BigNumberish,
      who: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    count(overrides?: CallOverrides): Promise<BigNumber>;

    ilk(overrides?: CallOverrides): Promise<BigNumber>;

    kick(
      tab: BigNumberish,
      lot: BigNumberish,
      usr: string,
      kpr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    kicks(overrides?: CallOverrides): Promise<BigNumber>;

    list(overrides?: CallOverrides): Promise<BigNumber>;

    sales(
      auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    take(
      id: BigNumberish,
      amt: BigNumberish,
      max: BigNumberish,
      who: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    count(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ilk(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    kick(
      tab: BigNumberish,
      lot: BigNumberish,
      usr: string,
      kpr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    kicks(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    list(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sales(
      auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    take(
      id: BigNumberish,
      amt: BigNumberish,
      max: BigNumberish,
      who: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
