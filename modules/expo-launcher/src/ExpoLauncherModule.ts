import { NativeModule, requireNativeModule } from 'expo';

import { ExpoLauncherModuleEvents } from './ExpoLauncher.types';

declare class ExpoLauncherModule extends NativeModule<ExpoLauncherModuleEvents> {
  isDefaultLauncher(): Promise<boolean>;
  setAsDefaultLauncher(): Promise<void>;
  getInstalledApps(): Promise<Array<{ name: string; packageName: string }>>;
  openApp(packageName: string): Promise<void>;
  kidSafeApps(): Promise<Array<{ name: string; packageName: string }>>;
  requestSetDefaultLauncher(): Promise<void>;
  startKioskMode(): Promise<void>;
  stopKioskMode(): Promise<void>;

}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoLauncherModule>('ExpoLauncher');
