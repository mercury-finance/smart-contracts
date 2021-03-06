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
    "flux(bytes32,address,address,uint256)": FunctionFragment;
    "fork(bytes32,address,address,int256,int256)": FunctionFragment;
    "frob(bytes32,address,address,address,int256,int256)": FunctionFragment;
    "hope(address)": FunctionFragment;
    "move(address,address,uint256)": FunctionFragment;
    "urns(bytes32,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "flux" | "fork" | "frob" | "hope" | "move" | "urns"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "flux",
    values: [BytesLike, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fork",
    values: [BytesLike, string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "frob",
    values: [BytesLike, string, string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "hope", values: [string]): string;
  encodeFunctionData(
    functionFragment: "move",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "urns",
    values: [BytesLike, string]
  ): string;

  decodeFunctionResult(functionFragment: "flux", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fork", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "frob", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hope", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "move", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "urns", data: BytesLike): Result;

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
    flux(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fork(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BigNumberish,
      arg4: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    frob(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: string,
      arg4: BigNumberish,
      arg5: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    move(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    urns(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };

  flux(
    arg0: BytesLike,
    arg1: string,
    arg2: string,
    arg3: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fork(
    arg0: BytesLike,
    arg1: string,
    arg2: string,
    arg3: BigNumberish,
    arg4: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  frob(
    arg0: BytesLike,
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: BigNumberish,
    arg5: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hope(
    arg0: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  move(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  urns(
    arg0: BytesLike,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  callStatic: {
    flux(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    fork(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BigNumberish,
      arg4: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    frob(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: string,
      arg4: BigNumberish,
      arg5: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    hope(arg0: string, overrides?: CallOverrides): Promise<void>;

    move(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    urns(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };

  filters: {};

  estimateGas: {
    flux(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fork(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BigNumberish,
      arg4: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    frob(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: string,
      arg4: BigNumberish,
      arg5: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    move(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    urns(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    flux(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fork(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: BigNumberish,
      arg4: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    frob(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      arg3: string,
      arg4: BigNumberish,
      arg5: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hope(
      arg0: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    move(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    urns(
      arg0: BytesLike,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
