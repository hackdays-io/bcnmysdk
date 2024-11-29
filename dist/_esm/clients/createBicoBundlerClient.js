import { http } from "viem";
import { createBundlerClient } from "viem/account-abstraction";
import { biconomyPaymasterContext } from "./createBicoPaymasterClient.js";
import { bicoBundlerActions } from "./decorators/bundler/index.js";
/**
 * Creates a Bico Bundler Client with a given Transport configured for a Chain.
 *
 * @param parameters - Configuration for the Bico Bundler Client
 * @returns A Bico Bundler Client
 *
 * @example
 * import { createBicoBundlerClient, http } from '@biconomy/sdk'
 * import { mainnet } from 'viem/chains'
 *
 * const bundlerClient = createBicoBundlerClient({ chain: mainnet });
 */
export const createBicoBundlerClient = (parameters) => {
    if (!parameters.apiKey &&
        !parameters.bundlerUrl &&
        !parameters.transport &&
        !parameters?.chain) {
        throw new Error("Cannot set determine a bundler url, please provide a chain.");
    }
    const defaultedTransport = parameters.transport
        ? parameters.transport
        : parameters.bundlerUrl
            ? http(parameters.bundlerUrl)
            : http(
            // @ts-ignore: Type saftey provided by the if statement above
            `https://bundler.biconomy.io/api/v3/${parameters.chain.id}/${parameters.apiKey ??
                "nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f14"}`);
    const defaultedUserOperation = parameters.userOperation ?? {
        estimateFeesPerGas: async (_) => {
            const gasFees = await bundler_.getGasFeeValues();
            return gasFees.fast;
        }
    };
    const defaultedPaymasterContext = parameters.paymaster
        ? parameters.paymasterContext ?? biconomyPaymasterContext
        : undefined;
    const bundler_ = createBundlerClient({
        ...parameters,
        transport: defaultedTransport,
        paymasterContext: defaultedPaymasterContext,
        userOperation: defaultedUserOperation
    }).extend(bicoBundlerActions());
    return bundler_;
};
//# sourceMappingURL=createBicoBundlerClient.js.map