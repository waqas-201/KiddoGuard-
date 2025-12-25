import { NativeModule, requireNativeModule } from 'expo';
import { ExpoScreenCheckModuleEvents } from './ExpoScreenCheck.types';

// We define the interface to include both your async functions 
// and the event listener capabilities
declare class ExpoScreenCheckModule extends NativeModule<ExpoScreenCheckModuleEvents> {
    /** Forces Android back to the Home/Launcher screen */
    goToHome(): Promise<void>;
    /** Prevents screenshots and hides app preview in the Task Switcher */
    setSecureFlag(enable: boolean): void;
    resetLauncherStack(): Promise<void>
}

export default requireNativeModule<ExpoScreenCheckModule>('ExpoScreenCheck');