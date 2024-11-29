import { accountId } from "./accountId.js";
import { getActiveHook } from "./getActiveHook.js";
import { getFallbackBySelector } from "./getFallbackBySelector.js";
import { getInstalledExecutors } from "./getInstalledExecutors.js";
import { getInstalledValidators } from "./getInstalledValidators.js";
import { getPreviousModule } from "./getPreviousModule.js";
import { installModule } from "./installModule.js";
import { installModules } from "./installModules.js";
import { isModuleInstalled } from "./isModuleInstalled.js";
import { supportsExecutionMode } from "./supportsExecutionMode.js";
import { supportsModule } from "./supportsModule.js";
import { uninstallModule } from "./uninstallModule.js";
import { uninstallModules } from "./uninstallModules.js";
export { accountId, installModule, installModules, isModuleInstalled, supportsExecutionMode, supportsModule, uninstallModule, uninstallModules, getInstalledValidators, getInstalledExecutors, getActiveHook, getFallbackBySelector, getPreviousModule };
export function erc7579Actions() {
    return (client) => ({
        accountId: (args) => accountId(client, args),
        installModule: (args) => installModule(client, args),
        installModules: (args) => installModules(client, args),
        isModuleInstalled: (args) => isModuleInstalled(client, args),
        supportsExecutionMode: (args) => supportsExecutionMode(client, args),
        supportsModule: (args) => supportsModule(client, args),
        uninstallModule: (args) => uninstallModule(client, args),
        uninstallModules: (args) => uninstallModules(client, args),
        getInstalledValidators: (args) => getInstalledValidators(client, args),
        getInstalledExecutors: (args) => getInstalledExecutors(client, args),
        getActiveHook: (args) => getActiveHook(client, args),
        getFallbackBySelector: (args) => getFallbackBySelector(client, args),
        getPreviousModule: (args) => getPreviousModule(client, args)
    });
}
//# sourceMappingURL=index.js.map