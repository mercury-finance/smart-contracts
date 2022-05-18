/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
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

export interface PipLikeInterface extends utils.Interface {
  functions: {
    "peek()": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "peek"): FunctionFragment;

  encodeFunctionData(functionFragment: "peek", values?: undefined): string;

  decodeFunctionResult(functionFragment: "peek", data: BytesLike): Result;

  events: {};
}

export interface PipLike extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PipLikeInterface;

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
    peek(overrides?: CallOverrides): Promise<[string, boolean]>;
  };

  peek(overrides?: CallOverrides): Promise<[string, boolean]>;

  callStatic: {
    peek(overrides?: CallOverrides): Promise<[string, boolean]>;
  };

  filters: {};

  estimateGas: {
    peek(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    peek(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
