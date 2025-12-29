import { NativeModule, requireNativeModule } from 'expo';

import { TimelimitModuleEvents } from './Timelimit.types';

declare class TimelimitModule extends NativeModule<TimelimitModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;

  //
  startCountdown(seconds: number): Promise<boolean>;
  stopCountdown(): Promise<number>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<TimelimitModule>('Timelimit');
