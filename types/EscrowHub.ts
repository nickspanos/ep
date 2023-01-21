import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  EscrowHub,
  EscrowHubMethodNames,
  EscrowHubEventsContext,
  EscrowHubEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type EscrowHubEvents =
  | 'AdminChanged'
  | 'BeaconUpgraded'
  | 'EscrowCreated'
  | 'EscrowUpdated'
  | 'Initialized'
  | 'OwnershipTransferred'
  | 'Upgraded';
export interface EscrowHubEventsContext {
  AdminChanged(...parameters: any): EventFilter;
  BeaconUpgraded(...parameters: any): EventFilter;
  EscrowCreated(...parameters: any): EventFilter;
  EscrowUpdated(...parameters: any): EventFilter;
  Initialized(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  Upgraded(...parameters: any): EventFilter;
}
export type EscrowHubMethodNames =
  | 'new'
  | 'claimAfterExpire'
  | 'deliver'
  | 'fetchEscrow'
  | 'fetchEscrowsPaginated'
  | 'fetchMyEscrows'
  | 'initialize'
  | 'newEscrow'
  | 'owner'
  | 'proxiableUUID'
  | 'refund'
  | 'renounceOwnership'
  | 'transferOwnership'
  | 'upgradeTo'
  | 'upgradeToAndCall';
export interface AdminChangedEventEmittedResponse {
  previousAdmin: string;
  newAdmin: string;
}
export interface BeaconUpgradedEventEmittedResponse {
  beacon: string;
}
export interface EscrowCreatedEventEmittedResponse {
  escrowId: BigNumberish;
  cid: string;
  buyer: string;
  seller: string;
  amount: BigNumberish;
  fee: BigNumberish;
  state: BigNumberish;
}
export interface EscrowUpdatedEventEmittedResponse {
  escrowId: BigNumberish;
  cid: string;
  buyer: string;
  seller: string;
  amount: BigNumberish;
  fee: BigNumberish;
  state: BigNumberish;
}
export interface InitializedEventEmittedResponse {
  version: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface UpgradedEventEmittedResponse {
  implementation: string;
}
export interface EscrowResponse {
  id: BigNumber;
  0: BigNumber;
  cid: string;
  1: string;
  buyer: string;
  2: string;
  seller: string;
  3: string;
  amount: BigNumber;
  4: BigNumber;
  fee: BigNumber;
  5: BigNumber;
  createdAt: BigNumber;
  6: BigNumber;
  expireAt: BigNumber;
  7: BigNumber;
  clearAt: BigNumber;
  8: BigNumber;
  state: number;
  9: number;
}
export interface DataResponse {
  id: BigNumber;
  0: BigNumber;
  cid: string;
  1: string;
  buyer: string;
  2: string;
  seller: string;
  3: string;
  amount: BigNumber;
  4: BigNumber;
  fee: BigNumber;
  5: BigNumber;
  createdAt: BigNumber;
  6: BigNumber;
  expireAt: BigNumber;
  7: BigNumber;
  clearAt: BigNumber;
  8: BigNumber;
  state: number;
  9: number;
}
export interface FetchEscrowsPaginatedResponse {
  data: DataResponse[];
  0: DataResponse[];
  totalItemCount: BigNumber;
  1: BigNumber;
  hasNextPage: boolean;
  2: boolean;
  nextCursor: BigNumber;
  3: BigNumber;
  length: 4;
}
export interface EscrowHub {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _escrowId Type: uint256, Indexed: false
   */
  claimAfterExpire(
    _escrowId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _escrowId Type: uint256, Indexed: false
   */
  deliver(
    _escrowId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param escrowId Type: uint256, Indexed: false
   */
  fetchEscrow(
    escrowId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<EscrowResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param cursor Type: uint256, Indexed: false
   * @param perPageCount Type: uint256, Indexed: false
   */
  fetchEscrowsPaginated(
    cursor: BigNumberish,
    perPageCount: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<FetchEscrowsPaginatedResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  fetchMyEscrows(overrides?: ContractCallOverrides): Promise<EscrowResponse[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  initialize(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _seller Type: address, Indexed: false
   * @param _cid Type: string, Indexed: false
   * @param expireIn Type: uint256, Indexed: false
   */
  newEscrow(
    _seller: string,
    _cid: string,
    expireIn: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  proxiableUUID(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _escrowId Type: uint256, Indexed: false
   */
  refund(
    _escrowId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newImplementation Type: address, Indexed: false
   */
  upgradeTo(
    newImplementation: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param newImplementation Type: address, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  upgradeToAndCall(
    newImplementation: string,
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
