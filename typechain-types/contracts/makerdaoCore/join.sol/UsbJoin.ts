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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../common";

export interface UsbJoinInterface extends utils.Interface {
  functions: {
    "cage()": FunctionFragment;
    "deny(address)": FunctionFragment;
    "exit(address,uint256)": FunctionFragment;
    "join(address,uint256)": FunctionFragment;
    "live()": FunctionFragment;
    "rely(address)": FunctionFragment;
    "usb()": FunctionFragment;
    "vat()": FunctionFragment;
    "wards(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "cage"
      | "deny"
      | "exit"
      | "join"
      | "live"
      | "rely"
      | "usb"
      | "vat"
      | "wards"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "cage", values?: undefined): string;
  encodeFunctionData(functionFragment: "deny", values: [string]): string;
  encodeFunctionData(
    functionFragment: "exit",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "join",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "live", values?: undefined): string;
  encodeFunctionData(functionFragment: "rely", values: [string]): string;
  encodeFunctionData(functionFragment: "usb", values?: undefined): string;
  encodeFunctionData(functionFragment: "vat", values?: undefined): string;
  encodeFunctionData(functionFragment: "wards", values: [string]): string;

  decodeFunctionResult(functionFragment: "cage", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deny", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "join", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "live", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rely", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "usb", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vat", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wards", data: BytesLike): Result;

  events: {
    "Cage()": EventFragment;
    "Deny(address)": EventFragment;
    "Exit(address,uint256)": EventFragment;
    "Join(address,uint256)": EventFragment;
    "Rely(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Cage"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deny"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Exit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Join"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Rely"): EventFragment;
}

export interface CageEventObject {}
export type CageEvent = TypedEvent<[], CageEventObject>;

export type CageEventFilter = TypedEventFilter<CageEvent>;

export interface DenyEventObject {
  usr: string;
}
export type DenyEvent = TypedEvent<[string], DenyEventObject>;

export type DenyEventFilter = TypedEventFilter<DenyEvent>;

export interface ExitEventObject {
  usr: string;
  wad: BigNumber;
}
export type ExitEvent = TypedEvent<[string, BigNumber], ExitEventObject>;

export type ExitEventFilter = TypedEventFilter<ExitEvent>;

export interface JoinEventObject {
  usr: string;
  wad: BigNumber;
}
export type JoinEvent = TypedEvent<[string, BigNumber], JoinEventObject>;

export type JoinEventFilter = TypedEventFilter<JoinEvent>;

export interface RelyEventObject {
  usr: string;
}
export type RelyEvent = TypedEvent<[string], RelyEventObject>;

export type RelyEventFilter = TypedEventFilter<RelyEvent>;

export interface UsbJoin extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UsbJoinInterface;

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
    cage(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deny(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exit(
      usr: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    join(
      usr: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    live(overrides?: CallOverrides): Promise<[BigNumber]>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    usb(overrides?: CallOverrides): Promise<[string]>;

    vat(overrides?: CallOverrides): Promise<[string]>;

    wards(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  cage(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deny(
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exit(
    usr: string,
    wad: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  join(
    usr: string,
    wad: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  live(overrides?: CallOverrides): Promise<BigNumber>;

  rely(
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  usb(overrides?: CallOverrides): Promise<string>;

  vat(overrides?: CallOverrides): Promise<string>;

  wards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    cage(overrides?: CallOverrides): Promise<void>;

    deny(usr: string, overrides?: CallOverrides): Promise<void>;

    exit(
      usr: string,
      wad: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    join(
      usr: string,
      wad: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    live(overrides?: CallOverrides): Promise<BigNumber>;

    rely(usr: string, overrides?: CallOverrides): Promise<void>;

    usb(overrides?: CallOverrides): Promise<string>;

    vat(overrides?: CallOverrides): Promise<string>;

    wards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "Cage()"(): CageEventFilter;
    Cage(): CageEventFilter;

    "Deny(address)"(usr?: string | null): DenyEventFilter;
    Deny(usr?: string | null): DenyEventFilter;

    "Exit(address,uint256)"(usr?: string | null, wad?: null): ExitEventFilter;
    Exit(usr?: string | null, wad?: null): ExitEventFilter;

    "Join(address,uint256)"(usr?: string | null, wad?: null): JoinEventFilter;
    Join(usr?: string | null, wad?: null): JoinEventFilter;

    "Rely(address)"(usr?: string | null): RelyEventFilter;
    Rely(usr?: string | null): RelyEventFilter;
  };

  estimateGas: {
    cage(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deny(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exit(
      usr: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    join(
      usr: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    live(overrides?: CallOverrides): Promise<BigNumber>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    usb(overrides?: CallOverrides): Promise<BigNumber>;

    vat(overrides?: CallOverrides): Promise<BigNumber>;

    wards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    cage(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deny(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exit(
      usr: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    join(
      usr: string,
      wad: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    live(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    usb(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    vat(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    wards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
