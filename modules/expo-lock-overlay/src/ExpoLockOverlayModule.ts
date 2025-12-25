import { NativeModule, requireNativeModule } from 'expo';

import { ExpoLockOverlayModuleEvents } from './ExpoLockOverlay.types';

declare class ExpoLockOverlayModule extends NativeModule<ExpoLockOverlayModuleEvents> {
  startOverlay(): Promise<void>;
  stopOverlay(): Promise<void>;
  hasOverlayPermission(): boolean;
  openOverlaySettings():null
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoLockOverlayModule>('ExpoLockOverlay');
