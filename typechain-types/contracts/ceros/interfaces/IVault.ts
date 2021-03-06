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

export interface IVaultInterface extends utils.Interface {
  functions: {
    "claimYields(address)": FunctionFragment;
    "claimYieldsFor(address,address)": FunctionFragment;
    "deposit(address,uint256)": FunctionFragment;
    "depositFor(address,uint256)": FunctionFragment;
    "getPrincipalOf(address)": FunctionFragment;
    "getTotalAmountInVault()": FunctionFragment;
    "getYieldFor(address)": FunctionFragment;
    "withdraw(address,uint256)": FunctionFragment;
    "withdrawFor(address,address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "claimYields"
      | "claimYieldsFor"
      | "deposit"
      | "depositFor"
      | "getPrincipalOf"
      | "getTotalAmountInVault"
      | "getYieldFor"
      | "withdraw"
      | "withdrawFor"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "claimYields", values: [string]): string;
  encodeFunctionData(
    functionFragment: "claimYieldsFor",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositFor",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPrincipalOf",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalAmountInVault",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getYieldFor", values: [string]): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFor",
    values: [string, string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "claimYields",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimYieldsFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "depositFor", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPrincipalOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalAmountInVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getYieldFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFor",
    data: BytesLike
  ): Result;

  events: {
    "Claimed(address,address,uint256)": EventFragment;
    "Deposited(address,address,uint256)": EventFragment;
    "RatioUpdated(uint256)": EventFragment;
    "RouterChanged(address)": EventFragment;
    "Withdrawn(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RatioUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RouterChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export interface ClaimedEventObject {
  owner: string;
  recipient: string;
  value: BigNumber;
}
export type ClaimedEvent = TypedEvent<
  [string, string, BigNumber],
  ClaimedEventObject
>;

export type ClaimedEventFilter = TypedEventFilter<ClaimedEvent>;

export interface DepositedEventObject {
  owner: string;
  recipient: string;
  value: BigNumber;
}
export type DepositedEvent = TypedEvent<
  [string, string, BigNumber],
  DepositedEventObject
>;

export type DepositedEventFilter = TypedEventFilter<DepositedEvent>;

export interface RatioUpdatedEventObject {
  currentRatio: BigNumber;
}
export type RatioUpdatedEvent = TypedEvent<
  [BigNumber],
  RatioUpdatedEventObject
>;

export type RatioUpdatedEventFilter = TypedEventFilter<RatioUpdatedEvent>;

export interface RouterChangedEventObject {
  router: string;
}
export type RouterChangedEvent = TypedEvent<[string], RouterChangedEventObject>;

export type RouterChangedEventFilter = TypedEventFilter<RouterChangedEvent>;

export interface WithdrawnEventObject {
  owner: string;
  recipient: string;
  value: BigNumber;
}
export type WithdrawnEvent = TypedEvent<
  [string, string, BigNumber],
  WithdrawnEventObject
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface IVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IVaultInterface;

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
    claimYields(
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimYieldsFor(
      owner: string,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deposit(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositFor(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getPrincipalOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTotalAmountInVault(overrides?: CallOverrides): Promise<[BigNumber]>;

    getYieldFor(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    withdraw(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawFor(
      owner: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  claimYields(
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimYieldsFor(
    owner: string,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deposit(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositFor(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getPrincipalOf(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTotalAmountInVault(overrides?: CallOverrides): Promise<BigNumber>;

  getYieldFor(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  withdraw(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawFor(
    owner: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    claimYields(
      recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimYieldsFor(
      owner: string,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposit(
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    depositFor(
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrincipalOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalAmountInVault(overrides?: CallOverrides): Promise<BigNumber>;

    getYieldFor(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawFor(
      owner: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "Claimed(address,address,uint256)"(
      owner?: string | null,
      recipient?: string | null,
      value?: null
    ): ClaimedEventFilter;
    Claimed(
      owner?: string | null,
      recipient?: string | null,
      value?: null
    ): ClaimedEventFilter;

    "Deposited(address,address,uint256)"(
      owner?: string | null,
      recipient?: string | null,
      value?: null
    ): DepositedEventFilter;
    Deposited(
      owner?: string | null,
      recipient?: string | null,
      value?: null
    ): DepositedEventFilter;

    "RatioUpdated(uint256)"(currentRatio?: null): RatioUpdatedEventFilter;
    RatioUpdated(currentRatio?: null): RatioUpdatedEventFilter;

    "RouterChanged(address)"(router?: null): RouterChangedEventFilter;
    RouterChanged(router?: null): RouterChangedEventFilter;

    "Withdrawn(address,address,uint256)"(
      owner?: string | null,
      recipient?: string | null,
      value?: null
    ): WithdrawnEventFilter;
    Withdrawn(
      owner?: string | null,
      recipient?: string | null,
      value?: null
    ): WithdrawnEventFilter;
  };

  estimateGas: {
    claimYields(
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimYieldsFor(
      owner: string,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deposit(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositFor(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getPrincipalOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalAmountInVault(overrides?: CallOverrides): Promise<BigNumber>;

    getYieldFor(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawFor(
      owner: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    claimYields(
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimYieldsFor(
      owner: string,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositFor(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getPrincipalOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalAmountInVault(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getYieldFor(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFor(
      owner: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
