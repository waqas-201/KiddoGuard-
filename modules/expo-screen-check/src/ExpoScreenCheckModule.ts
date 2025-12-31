import { NativeModule, requireNativeModule } from 'expo';
import { ExpoScreenCheckModuleEvents } from './ExpoScreenCheck.types';

// We define the interface to include both your async functions 
// and the event listener capabilities
declare class ExpoScreenCheckModule extends NativeModule<ExpoScreenCheckModuleEvents> {

}

export default requireNativeModule<ExpoScreenCheckModule>('ExpoScreenCheck');