import { NativeModule, requireNativeModule } from 'expo';
import { ExpoAppInstallListenerModuleEvents } from './ExpoAppInstallListener.types';

// The NativeModule class now handles all event logic internally via JSI
declare class ExpoAppInstallListenerModule extends NativeModule<ExpoAppInstallListenerModuleEvents> { }

export default requireNativeModule<ExpoAppInstallListenerModule>('ExpoAppInstallListener');