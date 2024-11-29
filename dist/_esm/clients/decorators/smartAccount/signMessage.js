import { parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
/**
 * Signs a message using the smart account.
 *
 * This function calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191):
 * `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * @param client - The client instance.
 * @param parameters - Parameters for signing the message.
 * @returns The signature as a hexadecimal string.
 * @throws {AccountNotFoundError} If the account is not found.
 *
 * @example
 * import { signMessage } from '@biconomy/sdk'
 *
 * const signature = await signMessage(nexusClient, {
 *   message: 'Hello, Biconomy!'
 * })
 * console.log(signature) // '0x...'
 */
export async function signMessage(client, { account: account_ = client.account, message }) {
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: "/docs/actions/wallet/signMessage"
        });
    const account = parseAccount(account_);
    return account.signMessage({ message });
}
//# sourceMappingURL=signMessage.js.map