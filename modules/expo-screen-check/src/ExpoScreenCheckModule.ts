import { NativeModule, requireNativeModule } from 'expo';
import { ExpoScreenCheckModuleEvents } from './ExpoScreenCheck.types';

declare class ExpoScreenCheckModule extends NativeModule<ExpoScreenCheckModuleEvents> { }

export default requireNativeModule<ExpoScreenCheckModule>('ExpoScreenCheck');
