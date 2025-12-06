import ExpoLauncherModule from './src/ExpoLauncherModule';
export * from './src/ExpoLauncher.types';
export { default } from './src/ExpoLauncherModule';
export { default as ExpoLauncherView } from './src/ExpoLauncherView';


export const isDefaultLauncher = () => ExpoLauncherModule.isDefaultLauncher();
export const setAsDefaultLauncher = () => ExpoLauncherModule.setAsDefaultLauncher();
export const getInstalledApps = () => ExpoLauncherModule.getInstalledApps();
export const openApp = (packageName: string) => ExpoLauncherModule.openApp(packageName);
export const getKidSafeApps = (): Promise<Array<{ appName: string; packageName: string }>> =>  ExpoLauncherModule.getKidSafeApps()
export const requestSetDefaultLauncher = () => ExpoLauncherModule.requestSetDefaultLauncher();
export const startKioskMode = () => ExpoLauncherModule.startKioskMode();
export const stopKioskMode = () => ExpoLauncherModule.stopKioskMode();