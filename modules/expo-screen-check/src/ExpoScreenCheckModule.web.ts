import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoScreenCheck.types';

type ExpoScreenCheckModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoScreenCheckModule extends NativeModule<ExpoScreenCheckModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoScreenCheckModule, 'ExpoScreenCheckModule');
