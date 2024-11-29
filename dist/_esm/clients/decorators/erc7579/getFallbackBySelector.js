import { readContract } from "viem/actions";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { GENERIC_FALLBACK_SELECTOR } from "../../../account/utils/Constants.js";
/**
 * Retrieves the fallback handler for a given selector in a smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account and optional selector.
 * @returns A tuple containing the call type and address of the fallback handler.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { getFallbackBySelector } from '@biconomy/sdk'
 *
 * const [callType, handlerAddress] = await getFallbackBySelector(nexusClient, {
 *   selector: '0x12345678'
 * })
 * console.log(callType, handlerAddress) // '0x1' '0x...'
 */
export async function getFallbackBySelector(client, parameters) {
    const { account: account_ = client.account, selector = GENERIC_FALLBACK_SELECTOR } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const publicClient = account.client;
    return getAction(publicClient, readContract, "readContract")({
        address: account.address,
        abi: [
            {
                inputs: [
                    {
                        internalType: "bytes4",
                        name: "selector",
                        type: "bytes4"
                    }
                ],
                name: "getFallbackHandlerBySelector",
                outputs: [
                    {
                        internalType: "CallType",
                        name: "",
                        type: "bytes1"
                    },
                    {
                        internalType: "address",
                        name: "",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            }
        ],
        functionName: "getFallbackHandlerBySelector",
        args: [selector]
    });
}
//# sourceMappingURL=getFallbackBySelector.js.map