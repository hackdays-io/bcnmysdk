import { encodePacked, parseAccount } from "viem/utils";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
export async function prepareSignatures(client, parameters) {
    const { account: account_ = client.account, signatures } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const publicClient = account?.client;
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    return encodePacked(signatures.map(() => "bytes"), signatures);
}
//# sourceMappingURL=prepareSignatures.js.map