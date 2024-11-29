import { encodeFunctionData, getAddress } from "viem";
import { sendUserOperation } from "viem/account-abstraction";
import { getAction } from "viem/utils";
import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { parseModuleTypeId } from "./supportsModule.js";
/**
 * Uninstalls multiple modules from a smart account.
 *
 * @param client - The client instance.
 * @param parameters - Parameters including the smart account, modules to uninstall, and optional gas settings.
 * @returns The hash of the user operation as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { uninstallModules } from '@biconomy/sdk'
 *
 * const userOpHash = await uninstallModules(nexusClient, {
 *   modules: [
 *     { type: 'executor', address: '0x...', context: '0x' },
 *     { type: 'validator', address: '0x...', context: '0x' }
 *   ]
 * })
 * console.log(userOpHash) // '0x...'
 */
export async function uninstallModules(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, modules } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    return getAction(client, sendUserOperation, "sendUserOperation")({
        calls: modules.map(({ type, address, initData }) => ({
            to: account.address,
            value: BigInt(0),
            data: encodeFunctionData({
                abi: [
                    {
                        name: "uninstallModule",
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
                                name: "deInitData"
                            }
                        ],
                        outputs: []
                    }
                ],
                functionName: "uninstallModule",
                args: [parseModuleTypeId(type), getAddress(address), initData ?? "0x"]
            })
        })),
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
//# sourceMappingURL=uninstallModules.js.map