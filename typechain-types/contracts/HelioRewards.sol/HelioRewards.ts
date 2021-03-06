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
} from "../../common";

export interface HelioRewardsInterface extends utils.Interface {
  functions: {
    "addRewards(address,uint256)": FunctionFragment;
    "claim(uint256)": FunctionFragment;
    "claimable(address,address)": FunctionFragment;
    "claimedRewards(address)": FunctionFragment;
    "deny(address)": FunctionFragment;
    "deposit(address,address)": FunctionFragment;
    "distributionApy(address)": FunctionFragment;
    "helioPrice()": FunctionFragment;
    "helioToken()": FunctionFragment;
    "initPool(address,bytes32,uint256)": FunctionFragment;
    "live()": FunctionFragment;
    "pendingRewards(address)": FunctionFragment;
    "piles(address,address)": FunctionFragment;
    "pools(address)": FunctionFragment;
    "poolsList(uint256)": FunctionFragment;
    "rate(address)": FunctionFragment;
    "rely(address)": FunctionFragment;
    "rewardsPool()": FunctionFragment;
    "setHelioToken(address)": FunctionFragment;
    "setRate(address,uint256)": FunctionFragment;
    "stop()": FunctionFragment;
    "unrealisedRewards(address,address)": FunctionFragment;
    "vat()": FunctionFragment;
    "wards(address)": FunctionFragment;
    "withdraw(address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addRewards"
      | "claim"
      | "claimable"
      | "claimedRewards"
      | "deny"
      | "deposit"
      | "distributionApy"
      | "helioPrice"
      | "helioToken"
      | "initPool"
      | "live"
      | "pendingRewards"
      | "piles"
      | "pools"
      | "poolsList"
      | "rate"
      | "rely"
      | "rewardsPool"
      | "setHelioToken"
      | "setRate"
      | "stop"
      | "unrealisedRewards"
      | "vat"
      | "wards"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addRewards",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "claim", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "claimable",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "claimedRewards",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "deny", values: [string]): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "distributionApy",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "helioPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "helioToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initPool",
    values: [string, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "live", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingRewards",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "piles",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "pools", values: [string]): string;
  encodeFunctionData(
    functionFragment: "poolsList",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "rate", values: [string]): string;
  encodeFunctionData(functionFragment: "rely", values: [string]): string;
  encodeFunctionData(
    functionFragment: "rewardsPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setHelioToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setRate",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "stop", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "unrealisedRewards",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "vat", values?: undefined): string;
  encodeFunctionData(functionFragment: "wards", values: [string]): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [string, string]
  ): string;

  decodeFunctionResult(functionFragment: "addRewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimable", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deny", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "distributionApy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "helioPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "helioToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "live", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "piles", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pools", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poolsList", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rely", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardsPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setHelioToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stop", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "unrealisedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "vat", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "Claimed(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
}

export interface ClaimedEventObject {
  user: string;
  amount: BigNumber;
}
export type ClaimedEvent = TypedEvent<[string, BigNumber], ClaimedEventObject>;

export type ClaimedEventFilter = TypedEventFilter<ClaimedEvent>;

export interface HelioRewards extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HelioRewardsInterface;

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
    addRewards(
      usr: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimable(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    claimedRewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    deny(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deposit(
      token: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    distributionApy(
      token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    helioPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    helioToken(overrides?: CallOverrides): Promise<[string]>;

    initPool(
      token: string,
      ilk: BytesLike,
      rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    live(overrides?: CallOverrides): Promise<[BigNumber]>;

    pendingRewards(
      usr: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    piles(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; ts: BigNumber }>;

    pools(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        rewardRate: BigNumber;
        rho: BigNumber;
        ilk: string;
      }
    >;

    poolsList(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    rate(token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardsPool(overrides?: CallOverrides): Promise<[BigNumber]>;

    setHelioToken(
      helioToken_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRate(
      token: string,
      newRate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unrealisedRewards(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    vat(overrides?: CallOverrides): Promise<[string]>;

    wards(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    withdraw(
      token: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addRewards(
    usr: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimable(
    token: string,
    usr: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  claimedRewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  deny(
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deposit(
    token: string,
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  distributionApy(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  helioPrice(overrides?: CallOverrides): Promise<BigNumber>;

  helioToken(overrides?: CallOverrides): Promise<string>;

  initPool(
    token: string,
    ilk: BytesLike,
    rate: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  live(overrides?: CallOverrides): Promise<BigNumber>;

  pendingRewards(usr: string, overrides?: CallOverrides): Promise<BigNumber>;

  piles(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; ts: BigNumber }>;

  pools(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, string] & {
      rewardRate: BigNumber;
      rho: BigNumber;
      ilk: string;
    }
  >;

  poolsList(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  rate(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  rely(
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardsPool(overrides?: CallOverrides): Promise<BigNumber>;

  setHelioToken(
    helioToken_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRate(
    token: string,
    newRate: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stop(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unrealisedRewards(
    token: string,
    usr: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  vat(overrides?: CallOverrides): Promise<string>;

  wards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  withdraw(
    token: string,
    usr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addRewards(
      usr: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    claim(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claimable(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimedRewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    deny(usr: string, overrides?: CallOverrides): Promise<void>;

    deposit(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<void>;

    distributionApy(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    helioPrice(overrides?: CallOverrides): Promise<BigNumber>;

    helioToken(overrides?: CallOverrides): Promise<string>;

    initPool(
      token: string,
      ilk: BytesLike,
      rate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    live(overrides?: CallOverrides): Promise<BigNumber>;

    pendingRewards(usr: string, overrides?: CallOverrides): Promise<BigNumber>;

    piles(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; ts: BigNumber }>;

    pools(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        rewardRate: BigNumber;
        rho: BigNumber;
        ilk: string;
      }
    >;

    poolsList(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    rate(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    rely(usr: string, overrides?: CallOverrides): Promise<void>;

    rewardsPool(overrides?: CallOverrides): Promise<BigNumber>;

    setHelioToken(
      helioToken_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setRate(
      token: string,
      newRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stop(overrides?: CallOverrides): Promise<void>;

    unrealisedRewards(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    vat(overrides?: CallOverrides): Promise<string>;

    wards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Claimed(address,uint256)"(
      user?: string | null,
      amount?: null
    ): ClaimedEventFilter;
    Claimed(user?: string | null, amount?: null): ClaimedEventFilter;
  };

  estimateGas: {
    addRewards(
      usr: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimable(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimedRewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    deny(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deposit(
      token: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    distributionApy(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    helioPrice(overrides?: CallOverrides): Promise<BigNumber>;

    helioToken(overrides?: CallOverrides): Promise<BigNumber>;

    initPool(
      token: string,
      ilk: BytesLike,
      rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    live(overrides?: CallOverrides): Promise<BigNumber>;

    pendingRewards(usr: string, overrides?: CallOverrides): Promise<BigNumber>;

    piles(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pools(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolsList(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rate(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardsPool(overrides?: CallOverrides): Promise<BigNumber>;

    setHelioToken(
      helioToken_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRate(
      token: string,
      newRate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unrealisedRewards(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    vat(overrides?: CallOverrides): Promise<BigNumber>;

    wards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      token: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addRewards(
      usr: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimable(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimedRewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deny(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      token: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    distributionApy(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    helioPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    helioToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initPool(
      token: string,
      ilk: BytesLike,
      rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    live(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingRewards(
      usr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    piles(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pools(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolsList(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rate(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rely(
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardsPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setHelioToken(
      helioToken_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRate(
      token: string,
      newRate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unrealisedRewards(
      token: string,
      usr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    vat(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    wards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      token: string,
      usr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
