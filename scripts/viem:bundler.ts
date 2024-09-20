import { config } from "dotenv"
import { http, type PublicClient, createPublicClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { toNexusAccount } from "../src/sdk/account/toNexusAccount"
import { getChain } from "../src/sdk/account/utils/getChain"
import { createBicoBundlerClient } from "../src/sdk/clients/createBicoBundlerClient"
import {
  biconomyPaymasterContext,
  createBicoPaymasterClient
} from "../src/sdk/clients/createBicoPaymasterClient"

config()

const k1ValidatorAddress = "0x663E709f60477f07885230E213b8149a7027239B"
const factoryAddress = "0x887Ca6FaFD62737D0E79A2b8Da41f0B15A864778"

const GAS_ESTIMATE = 1.25

const safeMultiplier = (bI: bigint, multiplier: number): bigint =>
  BigInt(Math.round(Number(bI) * multiplier))

export const getEnvVars = () => {
  return {
    bundlerUrl: process.env.BUNDLER_URL || "",
    privateKey: process.env.PRIVATE_KEY || "",
    paymasterUrl: process.env.PAYMASTER_URL || "",
    chainId: process.env.CHAIN_ID || "0"
  }
}

export const getConfig = () => {
  const {
    paymasterUrl,
    bundlerUrl,
    chainId: chainIdFromEnv,
    privateKey
  } = getEnvVars()

  const chainId = Number.parseInt(chainIdFromEnv)

  const chain = getChain(chainId)

  return {
    chain,
    chainId,
    paymasterUrl,
    bundlerUrl,
    privateKey
  }
}

const { chain, privateKey, bundlerUrl, paymasterUrl } = getConfig()

if ([chain, privateKey, bundlerUrl].every(Boolean) !== true)
  throw new Error("Missing env vars")

if (!paymasterUrl) console.log("Missing paymaster url")

const account = privateKeyToAccount(`0x${privateKey}`)
const recipient = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth

const publicClient = createPublicClient({
  chain,
  transport: http()
})

const main = async () => {
  const nexusAccount = await toNexusAccount({
    holder: account,
    chain,
    transport: http(),
    k1ValidatorAddress,
    factoryAddress
  })

  const bicoBundler = createBicoBundlerClient({
    chain,
    bundlerUrl,
    account: nexusAccount,
    ...(paymasterUrl
      ? {
          paymaster: createBicoPaymasterClient({
            transport: http(paymasterUrl)
          }),
          paymasterContext: biconomyPaymasterContext
        }
      : undefined),
    userOperation: {
      estimateFeesPerGas: async (parameters) => {
        const feeData = await (
          parameters?.account?.client as PublicClient
        )?.estimateFeesPerGas?.()
        const gas = {
          maxFeePerGas: safeMultiplier(feeData.maxFeePerGas, GAS_ESTIMATE),
          maxPriorityFeePerGas: safeMultiplier(
            feeData.maxPriorityFeePerGas,
            GAS_ESTIMATE
          )
        }
        return gas
      }
    }
  })

  const usesAltoBundler = process.env.BUNDLER_URL?.includes("pimlico")
  console.time("read methods")
  const results = await Promise.allSettled([
    bicoBundler.getChainId(),
    bicoBundler.getSupportedEntryPoints(),
    bicoBundler.prepareUserOperation({
      sender: account.address,
      nonce: 0n,
      data: "0x",
      signature: "0x",
      verificationGasLimit: 1n,
      preVerificationGas: 1n,
      callData: "0x",
      callGasLimit: 1n,
      maxFeePerGas: 1n,
      maxPriorityFeePerGas: 1n,
      account: nexusAccount
    })
  ])
  console.timeEnd("read methods")

  const successCount = results.filter((result) => result.status === "fulfilled")
  console.log(
    `running the ${usesAltoBundler ? "Alto" : "Bico"} bundler with ${
      successCount.length
    } successful calls`
  )

  console.time("write methods")
  const hash = await bicoBundler.sendUserOperation({
    calls: [
      {
        to: recipient,
        value: 1n
      }
    ],
    account: nexusAccount
  })
  const userOpReceipt = await bicoBundler.waitForUserOperationReceipt({ hash })
  const { transactionHash } = await publicClient.waitForTransactionReceipt({
    hash: userOpReceipt.receipt.transactionHash
  })
  console.timeEnd("write methods")
  console.log({ transactionHash })
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })