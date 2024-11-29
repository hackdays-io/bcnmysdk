import { sendUserOperation } from "viem/account-abstraction";
import { encodeFunctionData, getAction, parseAccount } from "viem/utils";
import { ERROR_MESSAGES } from "../../../account/index.js";
import { AccountNotFoundError } from "../../../account/utils/AccountNotFound.js";
import { SIMPLE_SESSION_VALIDATOR_ADDRESS, SMART_SESSIONS_ADDRESS } from "../../../constants/index.js";
import { SmartSessionAbi } from "../../../constants/abi/SmartSessionAbi.js";
import { applyDefaults, createActionConfig, createActionData, generateSalt, getPermissionId, toTimeRangePolicy, toUniversalActionPolicy } from "../Helpers.js";
/**
 * Generates the action data for creating sessions in the SmartSessionValidator.
 *
 * @param sessionRequestedInfo - Array of session data parameters.
 * @param client - The public client for blockchain interactions.
 * @returns A promise that resolves to the action data and permission IDs, or an Error.
 */
export const getPermissionAction = async ({ chainId, sessionRequestedInfo, client }) => {
    const sessions = [];
    const permissionIds = [];
    // Start populating the session for each param provided
    for (const sessionInfo of sessionRequestedInfo) {
        const actionPolicies = [];
        for (const actionPolicyInfo of sessionInfo.actionPoliciesInfo) {
            // TODO: make it easy to generate rules for particular contract and selectors.
            const actionConfig = createActionConfig(actionPolicyInfo.rules ?? [], actionPolicyInfo.valueLimit);
            // one may also pass baked up policyData.
            // create uni action policy here..
            const uniActionPolicyData = toUniversalActionPolicy(actionConfig);
            // create time range policy here..
            const timeFramePolicyData = toTimeRangePolicy(actionPolicyInfo.validUntil ?? 0, actionPolicyInfo.validAfter ?? 0);
            // Create ActionData
            const actionPolicy = createActionData(actionPolicyInfo.contractAddress, actionPolicyInfo.functionSelector, [uniActionPolicyData, timeFramePolicyData]);
            actionPolicies.push(actionPolicy);
        }
        const userOpTimeFramePolicyData = toTimeRangePolicy(sessionInfo.sessionValidUntil ?? 0, sessionInfo.sessionValidAfter ?? 0);
        const session = {
            chainId: BigInt(chainId),
            sessionValidator: sessionInfo.sessionValidatorAddress ?? SIMPLE_SESSION_VALIDATOR_ADDRESS,
            sessionValidatorInitData: sessionInfo.sessionKeyData, // sessionValidatorInitData: abi.encodePacked(sessionSigner.addr),
            salt: sessionInfo.salt ?? generateSalt(),
            userOpPolicies: [userOpTimeFramePolicyData],
            actions: actionPolicies,
            erc7739Policies: {
                allowedERC7739Content: [],
                erc1271Policies: []
            }
        };
        const permissionId = (await getPermissionId({
            client: client,
            session: session
        }));
        // push permissionId to the array
        permissionIds.push(permissionId);
        // Push to sessions array
        sessions.push(session);
    }
    const grantPermissionData = encodeFunctionData({
        abi: SmartSessionAbi,
        functionName: "enableSessions",
        args: [sessions]
    });
    return {
        action: {
            target: SMART_SESSIONS_ADDRESS,
            value: BigInt(0),
            callData: grantPermissionData
        },
        permissionIds: permissionIds
    };
};
/**
 * Adds multiple sessions to the SmartSessionValidator module of a given smart account.
 *
 * This function prepares and sends a user operation to create multiple sessions
 * for the specified modular smart account. Each session can have its own policies
 * and permissions.
 *
 * @template TModularSmartAccount - Type of the modular smart account, extending ModularSmartAccount or undefined.
 * @param client - The client used to interact with the blockchain.
 * @param parameters - Parameters including the smart account, required session specific policies info, and optional gas settings.
 * @returns A promise that resolves to an object containing the user operation hash and an array of permission IDs.
 *
 * @throws {AccountNotFoundError} If the account is not found.
 * @throws {Error} If there's an error getting the enable sessions action.
 *
 * @example
 * ```typescript
 * import { grantPermission } from '@biconomy/sdk'
 *
 * const result = await grantPermission(nexusClient, {
 *   sessionRequestedInfo: [
 *     {
 *       sessionKeyData: '0x...',
 *       actionPoliciesInfo: [
 *         {
 *           contractAddress: '0x...',
 *           functionSelector: '0x...',
 *           rules: [...],
 *           valueLimit: 1000000000000000000n
 *         }
 *       ],
 *       sessionValidUntil: 1234567890
 *     }
 *   ]
 * });
 * console.log(result.userOpHash); // '0x...'
 * console.log(result.permissionIds); // ['0x...', '0x...']
 * ```
 *
 * @remarks
 * - Ensure that the client has sufficient gas to cover the transaction.
 * - The number of sessions created is determined by the length of the `sessionRequestedInfo` array.
 * - Each session's policies and permissions are determined by the `actionPoliciesInfo` provided.
 */
export async function grantPermission(client, parameters) {
    const { publicClient: publicClient_ = client.account?.client, account: account_ = client.account, maxFeePerGas, maxPriorityFeePerGas, nonce, sessionRequestedInfo } = parameters;
    if (!account_) {
        throw new AccountNotFoundError({
            docsPath: "/nexus/nexus-client/methods#sendtransaction"
        });
    }
    const account = parseAccount(account_);
    const chainId = publicClient_?.chain?.id;
    if (!chainId) {
        throw new Error(ERROR_MESSAGES.CHAIN_NOT_FOUND);
    }
    const defaultedSessionRequestedInfo = sessionRequestedInfo.map(applyDefaults);
    const actionResponse = await getPermissionAction({
        chainId,
        client: publicClient_,
        sessionRequestedInfo: defaultedSessionRequestedInfo
    });
    if ("action" in actionResponse) {
        const { action } = actionResponse;
        if (!("callData" in action)) {
            throw new Error("Error getting enable sessions action");
        }
        const userOpHash = (await getAction(client, sendUserOperation, "sendUserOperation")({
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
        }));
        return {
            userOpHash: userOpHash,
            permissionIds: actionResponse.permissionIds
        };
    }
    throw new Error("Error getting enable sessions action");
}
//# sourceMappingURL=grantPermission.js.map