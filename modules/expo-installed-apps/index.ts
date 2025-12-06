// Reexport the native module. On web, it will be resolved to ExpoInstalledAppsModule.web.ts

import ExpoInstalledAppsModule from './src/ExpoInstalledAppsModule';
export { default } from './src/ExpoInstalledAppsModule';
export { default as ExpoInstalledAppsView } from './src/ExpoInstalledAppsView';
export * from  './src/ExpoInstalledApps.types';


export const getInstalledApps = () :Promise<string> => {
    return ExpoInstalledAppsModule.getInstalledApps(); 
}


export const getAppIcon = (packageName:string): Promise<string> => {  
    return ExpoInstalledAppsModule.getAppIcon(packageName);
}