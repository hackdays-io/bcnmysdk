import { SMART_SESSIONS_ADDRESS, SmartSessionMode, encodeSmartSessionSignature } from "@rhinestone/module-sdk";
import { encodePacked } from "viem";
import { toModule } from "../utils/toModule.js";
const DUMMY_ECDSA_SIG = "0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c";
/**
 * Gets the initialization data for a Use Session module.
 *
 * @param _ - Optional arguments (currently unused).
 * @returns The module metadata including address, type, and initialization data.
 */
export const getUsePermissionModuleInitData = (_) => ({
    address: SMART_SESSIONS_ADDRESS,
    type: "validator",
    initData: "0x"
});
/**
 * Gets the initialization data for a Use Session.
 *
 * @param signerAddress - The address of the signer for the session.
 * @returns The encoded initialization data as a hexadecimal string.
 */
export const getUsePermissionInitData = ({ signerAddress }) => encodePacked(["address"], [signerAddress]);
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
export const toSmartSessionsValidator = (parameters) => {
    const { account, signer, moduleInitData: moduleInitData_, deInitData = "0x", initData: initData_, moduleInitArgs: moduleInitArgs_ = { signerAddress: signer.address }, initArgs: initArgs_ = { signerAddress: signer.address }, moduleData: { permissionId = "0x", mode = SmartSessionMode.USE, enableSessionData } = {} } = parameters;
    const initData = initData_ ?? getUsePermissionInitData(initArgs_);
    const moduleInitData = moduleInitData_ ?? getUsePermissionModuleInitData(moduleInitArgs_);
    return toModule({
        signer,
        accountAddress: account.address,
        address: SMART_SESSIONS_ADDRESS,
        initData,
        moduleInitData,
        deInitData,
        getStubSignature: async () => encodeSmartSessionSignature({
            mode,
            permissionId,
            enableSessionData,
            signature: DUMMY_ECDSA_SIG
        }),
        signUserOpHash: async (userOpHash) => encodeSmartSessionSignature({
            mode,
            permissionId,
            enableSessionData,
            signature: await signer.signMessage({
                message: { raw: userOpHash }
            })
        })
    });
};
//# sourceMappingURL=toSmartSessionsValidator.js.map