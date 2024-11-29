import { type Address, type Hex } from "viem";
import type { ModuleMeta } from "../../modules/utils/Types";
import type { ModularSmartAccount } from "../utils/Types";
import type { Module, ModuleParameters } from "../utils/Types";
import { type ToModuleParameters } from "../utils/toModule";
import type { UsePermissionModuleData } from "./Types";
/**
 * Represents the implementation parameters for a Smart Session module.
 */
export type SmartSessionImplementation = ModuleParameters & {
    moduleData?: UsePermissionModuleData;
};
/**
 * Arguments for getting the initialization data for a Use Session module.
 */
export type UsePermissionModuleGetInitDataArgs = {
    signerAddress: Address;
};
/**
 * Parameters for creating a Use Session module.
 */
export type UsePermissionModuleParameters = Omit<ToModuleParameters, "accountAddress"> & {
    account: ModularSmartAccount;
    moduleData?: UsePermissionModuleData;
};
/**
 * Gets the initialization data for a Use Session module.
 *
 * @param _ - Optional arguments (currently unused).
 * @returns The module metadata including address, type, and initialization data.
 */
export declare const getUsePermissionModuleInitData: (_?: UsePermissionModuleGetInitDataArgs) => ModuleMeta;
/**
 * Gets the initialization data for a Use Session.
 *
 * @param signerAddress - The address of the signer for the session.
 * @returns The encoded initialization data as a hexadecimal string.
 */
export declare const getUsePermissionInitData: ({ signerAddress }: UsePermissionModuleGetInitDataArgs) => Hex;
/**
 * Creates a Smart Sessions module for a modular smart account.
 *
 * This function sets up a Smart Sessions module with the specified parameters,
 * including session mode, permission ID, and session data.
 *
 * @param parameters - The parameters for creating the Smart Sessions module.
 * @returns A Module object representing the created Smart Sessions module.
 *
 * @example
 * ```typescript
 * const smartSessionsModule = toSmartSessionsValidator({
 *   account: mySmartAccount,
 *   signer: mySigner,
 *   moduleData: {
 *     permissionId: '0x1234...',
 *     mode: SmartSessionMode.USE,
 *     enableSessionData: '0x5678...'
 *   }
 * });
 * ```
 *
 * @remarks
 * - The function generates stub signatures and can sign user operation hashes.
 * - It uses the SmartSession address from the predefined addresses.
 * - The default session mode is USE if not specified.
 */
export declare const toSmartSessionsValidator: (parameters: UsePermissionModuleParameters) => Module;
//# sourceMappingURL=toSmartSessionsValidator.d.ts.map