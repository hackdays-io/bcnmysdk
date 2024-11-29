import { type Address, type Hex } from "viem";
import type { Module, ModuleMeta } from "../utils/Types";
import { type ToModuleParameters } from "../utils/toModule";
export type ToK1ValidatorParameters = ToModuleParameters & {
    address?: Hex;
};
export type K1ModuleGetInitDataArgs = {
    signerAddress: Address;
};
export declare const getK1ModuleInitData: (_: K1ModuleGetInitDataArgs) => ModuleMeta;
export declare const getK1InitData: ({ signerAddress }: K1ModuleGetInitDataArgs) => `0x${string}`;
/**
 * Creates a K1 Validator Module instance.
 * This module provides validation functionality using the K1 algorithm for a Nexus account.
 *
 * @param accountAddress The address of the Nexus account.
 * @param client The client instance.
 * @param initData Initialization data for the module.
 * @param deInitData De-initialization data for the module.
 * @returns A promise that resolves to a K1 Validator Module instance.
 *
 * @example
 * const module = await toK1Validator({
 *   accountAddress: '0x1234...',
 *   client: nexusClient,
 *   initData: '0x...',
 *   deInitData: '0x...'
 * });
 *
 * // Use the module
 * const dummySignature = await module.getStubSignature();
 * const userOpSignature = await module.signUserOpHash('0x...');
 * const messageSignature = await module.signMessage('Hello, world!');
 */
export declare const toK1Validator: (parameters: ToK1ValidatorParameters) => Module;
//# sourceMappingURL=toK1Validator.d.ts.map