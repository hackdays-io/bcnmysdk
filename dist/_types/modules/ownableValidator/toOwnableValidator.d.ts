import { type Address, type Hex, type PublicClient } from "viem";
import type { ModularSmartAccount, Module, ModuleMeta, ModuleParameters } from "../utils/Types";
import { type ToModuleParameters } from "../utils/toModule";
/**
 * Parameters for creating an Ownable module.
 * Extends ToModuleParameters but replaces 'accountAddress' with 'account'.
 */
type ToOwnableValidatorModuleParameters = Omit<ToModuleParameters, "accountAddress"> & {
    /** The modular smart account to associate with this module. */
    account: ModularSmartAccount;
    /** Optional initialization arguments for the module. */
    moduleInitArgs?: GetOwnablesModuleInitDataParams;
    /** Optional public client for blockchain interactions. */
    client?: PublicClient;
};
/**
 * Parameters for initializing the Ownables module.
 */
export type GetOwnablesModuleInitDataParams = {
    /** The threshold number of signatures required for operations. */
    threshold: bigint;
    /** Array of owner addresses for the module. */
    owners: Address[];
};
/**
 * Parameters specific to the Ownable module.
 */
export type OwnableModuleParameters = ModuleParameters;
/**
 * Generates the initialization data for the Ownables module.
 *
 * @param parameters - The parameters for initializing the module.
 * @returns The module metadata including the address, type, and encoded init data.
 */
export declare const getOwnablesModuleInitData: (parameters: GetOwnablesModuleInitDataParams) => ModuleMeta;
/**
 * Generates the initialization data for the Ownables module.
 * This function currently returns an empty hex string.
 *
 * @param _ - Optional initialization parameters (currently unused).
 * @returns An empty hex string.
 */
export declare const getOwnablesInitData: (_?: GetOwnablesModuleInitDataParams) => Hex;
/**
 * Creates an Ownable module for a modular smart account.
 *
 * This function sets up an Ownable module with the specified parameters,
 * including threshold and owners for the smart account.
 *
 * @param parameters - The parameters for creating the Ownable module.
 * @returns A Module object representing the created Ownable module.
 *
 * @example
 * ```typescript
 * const ownableModule = toOwnableValidator({
 *   account: mySmartAccount,
 *   signer: mySigner,
 *   moduleInitArgs: {
 *     threshold: 2n,
 *     owners: ['0x123...', '0x456...']
 *   }
 * });
 * ```
 *
 * @remarks
 * - If the module is already installed, it will use the existing threshold.
 * - If not installed, it will use the threshold from the initialization parameters.
 * - The function generates a mock signature based on the threshold.
 */
export declare const toOwnableValidator: (parameters: ToOwnableValidatorModuleParameters) => Module;
export {};
//# sourceMappingURL=toOwnableValidator.d.ts.map