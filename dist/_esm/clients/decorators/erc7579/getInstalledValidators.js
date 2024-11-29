import { readContract } from "viem/actions";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { SENTINEL_ADDRESS } from "../../../account/utils/Constants.js";
/**
 * Retrieves the installed validators for a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, page size, and cursor.
 * @returns A tuple containing an array of validator addresses and the next cursor.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { getInstalledValidators } from '@biconomy/sdk'
 *
 * const [validators, nextCursor] = await getInstalledValidators(nexusClient, {
 *   pageSize: 10n
 * })
 * console.log(validators, nextCursor) // ['0x...', '0x...'], '0x...'
 */
export async function getInstalledValidators(client, parameters) {
    const account_ = parameters?.account ?? client.account;
    const pageSize = parameters?.pageSize ?? 100n;
    const cursor = parameters?.cursor ?? SENTINEL_ADDRESS;
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
                        internalType: "address",
                        name: "cursor",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "size",
                        type: "uint256"
                    }
                ],
                name: "getValidatorsPaginated",
                outputs: [
                    {
                        internalType: "address[]",
                        name: "array",
                        type: "address[]"
                    },
                    {
                        internalType: "address",
                        name: "next",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            }
        ],
        functionName: "getValidatorsPaginated",
        args: [cursor, pageSize]
    });
}
//# sourceMappingURL=getInstalledValidators.js.map