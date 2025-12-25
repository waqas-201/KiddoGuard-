import { NativeModule, requireNativeModule } from 'expo';

import { ExpoLauncherModuleEvents } from './ExpoLauncher.types';

declare class ExpoLauncherModule extends NativeModule<ExpoLauncherModuleEvents> {
  isDefaultLauncher(): Promise<boolean>;
  setAsDefaultLauncher(): Promise<void>;
  openApp(packageName: string): Promise<void>;
  requestSetDefaultLauncher(): Promise<void>;
  startKioskMode(): Promise<void>;
  stopKioskMode(): Promise<void>;

}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoLauncherModule>('ExpoLauncher');
