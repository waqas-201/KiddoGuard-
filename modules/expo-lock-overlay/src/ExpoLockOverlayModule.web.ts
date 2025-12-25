import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoLockOverlay.types';

type ExpoLockOverlayModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoLockOverlayModule extends NativeModule<ExpoLockOverlayModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoLockOverlayModule, 'ExpoLockOverlayModule');
