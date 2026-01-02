import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoAppInstallListener.types';

type ExpoAppInstallListenerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoAppInstallListenerModule extends NativeModule<ExpoAppInstallListenerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoAppInstallListenerModule, 'ExpoAppInstallListenerModule');
