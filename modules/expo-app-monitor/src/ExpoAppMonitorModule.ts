import { NativeModule, requireNativeModule } from 'expo';
import { ExpoAppMonitorModuleEvents } from './ExpoAppMonitor.types';

declare class ExpoAppMonitorModule extends NativeModule<ExpoAppMonitorModuleEvents> {
  setValueAsync(): Promise<string>;
  // AsyncFunctions always return Promises in the JS bridge
  isServiceEnabled(): Promise<boolean>;
  openAccessibilitySettings(): Promise<void>;
  // Add the new Milestone 2 function
  bringAppToFront(): Promise<boolean>;
}

export default requireNativeModule<ExpoAppMonitorModule>('ExpoAppMonitor');