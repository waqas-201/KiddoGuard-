// Reexport the native module. On web, it will be resolved to ExpoInstalledAppsModule.web.ts

import ExpoInstalledAppsModule from './src/ExpoInstalledAppsModule';
export * from './src/ExpoInstalledApps.types';
export { default } from './src/ExpoInstalledAppsModule';
export { default as ExpoInstalledAppsView } from './src/ExpoInstalledAppsView';


export const getInstalledApps = () :Promise<string> => {
    return ExpoInstalledAppsModule.getInstalledApps(); 
}


export const getAppIcon = (packageName:string): Promise<string> => {  
    return ExpoInstalledAppsModule.getAppIcon(packageName);
}

export const getAppLabel = (packageName: string): Promise<string> => {
    return ExpoInstalledAppsModule.getAppLabel(packageName)
}