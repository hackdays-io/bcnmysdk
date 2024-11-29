import type { Chain, Client, Hash, Transport } from "viem";
import type { ModularSmartAccount, Module } from "../../utils/Types";
import type { GrantPermissionResponse } from "../Types";
import { type GrantPermissionParameters } from "./grantPermission";
import { type TrustAttestersParameters } from "./trustAttesters";
import { type UsePermissionParameters } from "./usePermission";
/**
 * Defines the shape of actions available for creating smart sessions.
 *
 * @template TModularSmartAccount - Type of the modular smart account, extending ModularSmartAccount or undefined.
 */
export type SmartSessionCreateActions<TModularSmartAccount extends ModularSmartAccount | undefined> = {
    /**
     * Creates multiple sessions for a modular smart account.
     *
     * @param args - Parameters for creating sessions.
     * @returns A promise that resolves to the creation response.
     */
    grantPermission: (args: GrantPermissionParameters<TModularSmartAccount>) => Promise<GrantPermissionResponse>;
    /**
     * Trusts attesters for a modular smart account.
     *
     * @param args - Parameters for trusting attesters.
     * @returns A promise that resolves to the transaction hash.
     */
    trustAttesters: (args?: TrustAttestersParameters<TModularSmartAccount>) => Promise<Hash>;
};
/**
 * Defines the shape of actions available for using smart sessions.
 *
 * @template TModularSmartAccount - Type of the modular smart account, extending ModularSmartAccount or undefined.
 */
export type SmartSessionUseActions<TModularSmartAccount extends ModularSmartAccount | undefined> = {
    /**
     * Uses a session to perform an action.
     *
     * @param args - Parameters for using a session.
     * @returns A promise that resolves to the transaction hash.
     */
    usePermission: (args: UsePermissionParameters<TModularSmartAccount>) => Promise<Hash>;
};
/**
 * Creates actions for managing smart session creation.
 *
 * @param _ - Unused parameter (placeholder for potential future use).
 * @returns A function that takes a client and returns SmartSessionCreateActions.
 */
export declare function smartSessionCreateActions(_: Module): <TModularSmartAccount extends ModularSmartAccount | undefined>(client: Client<Transport, Chain | undefined, TModularSmartAccount>) => SmartSessionCreateActions<TModularSmartAccount>;
/**
 * Creates actions for using smart sessions.
 *
 * @param smartSessionsModule - The smart sessions module to be set on the client's account.
 * @returns A function that takes a client and returns SmartSessionUseActions.
 */
export declare function smartSessionUseActions(smartSessionsModule: Module): <TModularSmartAccount extends ModularSmartAccount | undefined>(client: Client<Transport, Chain | undefined, TModularSmartAccount>) => SmartSessionUseActions<TModularSmartAccount>;
export * from "./grantPermission";
export * from "./trustAttesters";
export * from "./usePermission";
//# sourceMappingURL=index.d.ts.map