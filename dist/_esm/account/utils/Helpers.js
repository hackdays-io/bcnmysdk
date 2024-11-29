export const isDebugging = () => {
    if (typeof process === "undefined")
        return false;
    return (process.env.BICONOMY_SDK_DEBUG === "true" ||
        process.env.REACT_APP_BICONOMY_SDK_DEBUG === "true" ||
        process.env.NEXT_PUBLIC_BICONOMY_SDK_DEBUG === "true");
};
export const bigIntReplacer = (_, value) => {
    if (typeof value === "bigint") {
        return `${value.toString()}n`;
    }
    return value;
};
//# sourceMappingURL=Helpers.js.map