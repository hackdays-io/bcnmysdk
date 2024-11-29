import { http } from "viem";
import { createPaymasterClient } from "viem/account-abstraction";
/**
 * Context for the Bico Paymaster.
 */
export const biconomyPaymasterContext = {
    mode: "SPONSORED",
    expiryDuration: 300,
    calculateGasLimits: true,
    sponsorshipInfo: {
        smartAccountInfo: {
            name: "BICONOMY",
            version: "1.0.0"
        }
    }
};
/**
 * Creates a Bico Paymaster Client.
 *
 * This function sets up a client for interacting with Biconomy's paymaster service.
 * It can be configured with a custom transport, a specific paymaster URL, or with a chain ID and API key.
 *
 * @param {BicoPaymasterClientConfig} parameters - Configuration options for the client.
 * @returns {PaymasterClient} A configured Paymaster Client instance.
 *
 * @example
 * // Create a client with a custom transport
 * const client1 = createBicoPaymasterClient({ transport: customTransport })
 *
 * @example
 * // Create a client with a specific paymaster URL
 * const client2 = createBicoPaymasterClient({ paymasterUrl: 'https://example.com/paymaster' })
 *
 * @example
 * // Create a client with chain ID and API key
 * const client3 = createBicoPaymasterClient({ chainId: 1, apiKey: 'your-api-key' })
 */
export const createBicoPaymasterClient = (parameters) => {
    const defaultedTransport = parameters.transport
        ? parameters.transport
        : parameters.paymasterUrl
            ? http(parameters.paymasterUrl)
            : http(`https://paymaster.biconomy.io/api/v2/${parameters.chainId}/${parameters.apiKey}`);
    // Remove getPaymasterStubData from the client.
    const { getPaymasterStubData, ...paymasterClient } = createPaymasterClient({
        ...parameters,
        transport: defaultedTransport
    });
    return paymasterClient;
};
//# sourceMappingURL=createBicoPaymasterClient.js.map