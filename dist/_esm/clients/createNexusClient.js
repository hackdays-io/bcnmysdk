import { toNexusAccount } from "../account/toNexusAccount.js";
import { k1ValidatorAddress as k1ValidatorAddress_, k1ValidatorFactoryAddress } from "../constants/index.js";
import { createBicoBundlerClient } from "./createBicoBundlerClient.js";
import { erc7579Actions } from "./decorators/erc7579/index.js";
import { smartAccountActions } from "./decorators/smartAccount/index.js";
/**
 * Creates a Nexus Client for interacting with the Nexus smart account system.
 *
 * @param parameters - {@link NexusClientConfig}
 * @returns Nexus Client. {@link NexusClient}
 *
 * @example
 * import { createNexusClient } from '@biconomy/sdk'
 * import { http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const nexusClient = await createNexusClient({
 *   chain: mainnet,
 *   transport: http('https://mainnet.infura.io/v3/YOUR-PROJECT-ID'),
 *   bundlerTransport: http('https://api.biconomy.io'),
 *   signer: '0x...',
 * })
 */
export async function createNexusClient(parameters) {
    const { client: client_, chain = parameters.chain ?? client_?.chain, signer, index = 0n, key = "nexus client", name = "Nexus Client", module, factoryAddress = k1ValidatorFactoryAddress, k1ValidatorAddress = k1ValidatorAddress_, bundlerTransport, transport, accountAddress, ...bundlerConfig } = parameters;
    if (!chain)
        throw new Error("Missing chain");
    const nexusAccount = await toNexusAccount({
        accountAddress,
        transport,
        chain,
        signer,
        index,
        module,
        factoryAddress,
        k1ValidatorAddress
    });
    const bundler_ = createBicoBundlerClient({
        ...bundlerConfig,
        chain,
        key,
        name,
        account: nexusAccount,
        transport: bundlerTransport
    })
        .extend(erc7579Actions())
        .extend(smartAccountActions());
    return bundler_;
}
//# sourceMappingURL=createNexusClient.js.map