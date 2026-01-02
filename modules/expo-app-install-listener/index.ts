import ExpoAppInstallListenerModule from './src/ExpoAppInstallListenerModule';

/**
 * Listens for when a new app is installed.
 */
export function addAppInstallListener(listener: (event: { packageName: string }) => void) {
    return ExpoAppInstallListenerModule.addListener('onAppInstalled', listener);
}

/**
 * Listens for when an app is uninstalled.
 * Matches the 'onAppRemoved' event from Kotlin.
 */
export function addAppUninstallListener(listener: (event: { packageName: string }) => void) {
    return ExpoAppInstallListenerModule.addListener('onAppRemoved', listener);
}

export default ExpoAppInstallListenerModule;