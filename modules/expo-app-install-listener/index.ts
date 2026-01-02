import ExpoAppInstallListenerModule from './src/ExpoAppInstallListenerModule';

// No EventEmitter wrapper needed! 
// We use the module instance directly.
export function addAppInstallListener(listener: (event: { packageName: string }) => void) {
    return ExpoAppInstallListenerModule.addListener('onAppInstalled', listener);
}

export default ExpoAppInstallListenerModule;