import { sendUserOperation, waitForUserOperationReceipt } from "viem/account-abstraction";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { bigIntReplacer } from "../../../account/utils/Helpers.js";
import { Logger } from "../../../account/utils/Logger.js";
/**
 * Creates, signs, and sends a new transaction to the network using a smart account.
 * This function also allows you to sponsor this transaction if the sender is a smart account.
 *
 * @param client - The client instance.
 * @param args - Parameters for sending the transaction or user operation.
 * @returns The transaction hash as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { sendTransaction } from '@biconomy/sdk'
 *
 * const hash = await sendTransaction(nexusClient, {
 *   to: '0x...',
 *   value: parseEther('0.1'),
 *   data: '0x...'
 * })
 * console.log(hash) // '0x...'
 */
export async function sendTransaction(client, args, signature) {
    let userOpHash;
    if ("to" in args) {
        const { account: account_ = client.account, data, maxFeePerGas, maxPriorityFeePerGas, to, value, nonce } = args;
        if (!account_) {
            throw new AccountNotFoundError({
                docsPath: "/nexus/nexus-client/methods#sendtransaction"
            });
        }
        const account = parseAccount(account_);
        if (!to)
            throw new Error("Missing to address");
        const sendUserOperationArgs = {
            calls: [
                {
                    to,
                    value: value || BigInt(0),
                    data: data || "0x"
                }
            ],
            account,
            maxFeePerGas,
            maxPriorityFeePerGas,
            signature,
            nonce: nonce ? BigInt(nonce) : undefined
        };
        const { account: _, ...logableArgs } = sendUserOperationArgs;
        Logger.log(JSON.stringify(logableArgs, bigIntReplacer, 2));
        userOpHash = await getAction(client, sendUserOperation, "sendUserOperation")(sendUserOperationArgs);
    }
    else {
        userOpHash = await getAction(client, sendUserOperation, "sendUserOperation")({ ...args, signature });
    }
    const userOperationReceipt = await getAction(client, waitForUserOperationReceipt, "waitForUserOperationReceipt")({
        hash: userOpHash
    });
    return userOperationReceipt?.receipt.transactionHash;
}
//# sourceMappingURL=sendTransaction.js.map