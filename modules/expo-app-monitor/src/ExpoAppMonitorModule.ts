import { NativeModule, requireNativeModule } from 'expo';

import { ExpoAppMonitorModuleEvents } from './ExpoAppMonitor.types';

declare class ExpoAppMonitorModule extends NativeModule<ExpoAppMonitorModuleEvents> {

  setValueAsync(): Promise<void>;       // async function
  isServiceEnabled():boolean


}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAppMonitorModule>('ExpoAppMonitor');
