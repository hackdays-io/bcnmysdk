import { encodeFunctionData, getAddress } from "viem";
import { sendUserOperation } from "viem/account-abstraction";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { parseModuleTypeId } from "./supportsModule.js";
/**
 * Installs multiple modules on a given smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, modules to install, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { installModules } from '@biconomy/sdk'
 *
 * const userOpHash = await installModules(nexusClient, {
 *   modules: [
 *     { type: 'executor', address: '0x...', context: '0x' },
 *     { type: 'validator', address: '0x...', context: '0x' }
 *   ]
 * })
 * console.log(userOpHash) // '0x...'
 */
export async function installModules(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, modules } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    return getAction(client, sendUserOperation, "sendUserOperation")({
        calls: modules.map(({ type, address, data }) => ({
            to: account.address,
            value: BigInt(0),
            data: encodeFunctionData({
                abi: [
                    {
                        name: "installModule",
                        type: "function",
                        stateMutability: "nonpayable",
                        inputs: [
                            {
                                type: "uint256",
                                name: "moduleTypeId"
                            },
                            {
                                type: "address",
                                name: "module"
                            },
                            {
                                type: "bytes",
                                name: "initData"
                            }
                        ],
                        outputs: []
                    }
                ],
                functionName: "installModule",
                args: [parseModuleTypeId(type), getAddress(address), data]
            })
        })),
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account: account
    });
}
//# sourceMappingURL=installModules.js.map