import { encodeFunctionData } from "viem";
import { sendUserOperation } from "viem/account-abstraction";
import { getAction, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { MOCK_ATTESTER_ADDRESS, REGISTRY_ADDRESS } from "../../../constants/index.js";
/**
 * Trusts attesters for the smart session validator.
 *
 * This function prepares and sends a user operation to trust specified attesters
 * in the smart session validator's registry.
 *
 * @template TModularSmartAccount - Type of the modular smart account, extending ModularSmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - Parameters including the attesters to trust, registry address, and optional gas settings.
 * @returns A promise that resolves to the hash of the sent user operation.
 *
 * @throws {AccountNotFoundError} If no account is provided and the client doesn't have an associated account.
 *
 * @example
 * ```typescript
 * const result = await trustAttesters(nexusClient, {
 *   attesters: ['0x1234...', '0x5678...'],
 *   registryAddress: '0xabcd...',
 *   maxFeePerGas: 1000000000n
 * });
 * console.log(`Transaction hash: ${result}`);
 * ```
 *
 * @remarks
 * - Ensure that the client has sufficient gas to cover the transaction.
 * - The registry address should be the address of the contract managing trusted attesters.
 */
export async function trustAttesters(client, parameters) {
    const { account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, attesters = [MOCK_ATTESTER_ADDRESS], registryAddress = REGISTRY_ADDRESS, threshold = attesters.length } = parameters ?? {};
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const trustAttestersData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    { internalType: "uint8", name: "threshold", type: "uint8" },
                    { internalType: "address[]", name: "attesters", type: "address[]" }
                ],
                name: "trustAttesters",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }
        ],
        functionName: "trustAttesters",
        args: [threshold, attesters]
    });
    return getAction(client, sendUserOperation, "sendUserOperation")({
        calls: [
            {
                to: registryAddress,
                value: 0n,
                data: trustAttestersData
            }
        ],
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account
    });
}
//# sourceMappingURL=trustAttesters.js.map