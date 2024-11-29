import { type Address, type Client, type Hash, type Hex, type PublicClient, type TypedData, type TypedDataDomain, type TypedDataParameter } from "viem";
import { type ModuleType } from "../../modules/utils/Types";
import type { AccountMetadata, UserOperationStruct } from "./Types";
/**
 * pack the userOperation
 * @param op
 * @param forSignature "true" if the hash is needed to calculate the getUserOpHash()
 *  "false" to pack entire UserOp, for calculating the calldata cost of putting it on-chain.
 */
export declare function packUserOp(userOperation: Partial<UserOperationStruct>): string;
export declare const isNullOrUndefined: (value: any) => value is undefined;
export declare const isValidRpcUrl: (url: string) => boolean;
export declare const addressEquals: (a?: string, b?: string) => boolean;
export type SignWith6492Params = {
    factoryAddress: Address;
    factoryCalldata: Hex;
    signature: Hash;
};
export declare const wrapSignatureWith6492: ({ factoryAddress, factoryCalldata, signature, }: SignWith6492Params) => Hash;
export declare function percentage(partialValue: number, totalValue: number): number;
export declare function convertToFactor(percentage: number | undefined): number;
export declare function makeInstallDataAndHash(accountOwner: Address, modules: {
    type: ModuleType;
    config: Hex;
}[], domainName?: string, domainVersion?: string): [string, string];
export declare function _hashTypedData(structHash: Hex, name: string, version: string, verifyingContract: Address): string;
export declare function getTypesForEIP712Domain({ domain, }: {
    domain?: TypedDataDomain | undefined;
}): TypedDataParameter[];
export declare const getAccountMeta: (client: Client, accountAddress: Address) => Promise<AccountMetadata>;
export declare const eip712WrapHash: (typedHash: Hex, appDomainSeparator: Hex) => Hex;
export type TypedDataWith712 = {
    EIP712Domain: TypedDataParameter[];
} & TypedData;
export declare function typeToString(typeDef: TypedDataWith712): string[];
/** @ignore */
export declare function bigIntReplacer(_key: string, value: any): any;
export declare function numberTo3Bytes(key: bigint): Uint8Array;
export declare function toHexString(byteArray: Uint8Array): string;
export declare const getAccountDomainStructFields: (publicClient: PublicClient, accountAddress: Address) => Promise<`0x${string}`>;
export declare const playgroundTrue: boolean;
export declare const isTesting: boolean;
export declare const safeMultiplier: (bI: bigint, multiplier: number) => bigint;
//# sourceMappingURL=Utils.d.ts.map