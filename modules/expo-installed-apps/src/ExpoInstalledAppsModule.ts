import { NativeModule, requireNativeModule } from 'expo';

import { ExpoInstalledAppsModuleEvents } from './ExpoInstalledApps.types';

declare class ExpoInstalledAppsModule extends NativeModule<ExpoInstalledAppsModuleEvents> {

  getInstalledApps: () => Promise<string>;
  getAppIcon: (packageName: string) => Promise<string>;
  getAppLabel: (packageName: string) => Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoInstalledAppsModule>('ExpoInstalledApps');
