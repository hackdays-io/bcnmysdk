import { getSetOwnableValidatorThresholdAction } from "@rhinestone/module-sdk";
import { sendUserOperation } from "viem/account-abstraction";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
/**
 * Sets a new threshold for a modular smart account.
 *
 * This function prepares and sends a user operation to change the threshold of the specified modular smart account.
 * The threshold determines how many owners need to approve a transaction before it can be executed.
 *
 * @template TModularSmartAccount - Type of the modular smart account, extending ModularSmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - The parameters for setting the new threshold.
 * @returns A promise that resolves to the hash of the sent user operation.
 *
 * @throws {AccountNotFoundError} If no account is provided and the client doesn't have an associated account.
 *
 * @example
 * ```typescript
 * const nexusClient = createNexusClient({ ... });
 * const hash = await setThreshold(nexusClient, {
 *   threshold: 2,
 *   maxFeePerGas: 1000000000n
 * });
 * console.log(`Set threshold transaction hash: ${hash}`);
 * ```
 *
 * @remarks
 * - Ensure that the new threshold is valid for the current number of owners in the account.
 * - This operation will modify the state of the smart account on the blockchain.
 * - The transaction may fail if the caller doesn't have the necessary permissions to change the threshold.
 */
export async function setThreshold(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, threshold } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const action = getSetOwnableValidatorThresholdAction({ threshold });
    return getAction(client, sendUserOperation, "sendUserOperation")({
        calls: [
            {
                to: action.target,
                value: BigInt(action.value.toString()),
                data: action.callData
            }
        ],
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
//# sourceMappingURL=setThreshold.js.map