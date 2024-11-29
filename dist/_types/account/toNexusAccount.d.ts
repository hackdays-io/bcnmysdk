import { type Account, type Address, type Chain, type ClientConfig, type Hex, type Prettify, type PublicClient, type RpcSchema, type Transport, type WalletClient } from "viem";
import { type SmartAccount, type SmartAccountImplementation } from "viem/account-abstraction";
import { EntrypointAbi } from "../constants/abi";
import type { Call, UserOperationStruct } from "./utils/Types";
import type { Module } from "../modules/utils/Types";
import { type Signer, type UnknownSigner } from "./utils/toSigner";
/**
 * Parameters for creating a Nexus Smart Account
 */
export type ToNexusSmartAccountParameters = {
    /** The blockchain network */
    chain: Chain;
    /** The transport configuration */
    transport: ClientConfig["transport"];
    /** The signer account or address */
    signer: UnknownSigner;
    /** Optional index for the account */
    index?: bigint | undefined;
    /** Optional active validation module */
    module?: Module;
    /** Optional factory address */
    factoryAddress?: Address;
    /** Optional K1 validator address */
    k1ValidatorAddress?: Address;
    /** Optional account address override */
    accountAddress?: Address;
} & Prettify<Pick<ClientConfig<Transport, Chain, Account, RpcSchema>, "account" | "cacheTime" | "chain" | "key" | "name" | "pollingInterval" | "rpcSchema">>;
/**
 * Nexus Smart Account type
 */
export type NexusAccount = Prettify<SmartAccount<NexusSmartAccountImplementation>>;
/**
 * Nexus Smart Account Implementation
 */
export type NexusSmartAccountImplementation = SmartAccountImplementation<typeof EntrypointAbi, "0.7", {
    getCounterFactualAddress: () => Promise<Address>;
    isDeployed: () => Promise<boolean>;
    getInitCode: () => Hex;
    encodeExecute: (call: Call) => Promise<Hex>;
    encodeExecuteBatch: (calls: readonly Call[]) => Promise<Hex>;
    getUserOpHash: (userOp: Partial<UserOperationStruct>) => Promise<Hex>;
    setModule: (validationModule: Module) => void;
    getModule: () => Module;
    factoryData: Hex;
    factoryAddress: Address;
    signer: Signer;
    publicClient: PublicClient;
    walletClient: WalletClient;
}>;
/**
 * @description Create a Nexus Smart Account.
 *
 * @param parameters - {@link ToNexusSmartAccountParameters}
 * @returns Nexus Smart Account. {@link NexusAccount}
 *
 * @example
 * import { toNexusAccount } from '@biconomy/sdk'
 * import { createWalletClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const account = await toNexusAccount({
 *   chain: mainnet,
 *   transport: http(),
 *   signer: '0x...',
 * })
 */
export declare const toNexusAccount: (parameters: ToNexusSmartAccountParameters) => Promise<NexusAccount>;
//# sourceMappingURL=toNexusAccount.d.ts.map