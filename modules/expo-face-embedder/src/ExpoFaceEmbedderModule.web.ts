import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoFaceEmbedder.types';

type ExpoFaceEmbedderModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoFaceEmbedderModule extends NativeModule<ExpoFaceEmbedderModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoFaceEmbedderModule, 'ExpoFaceEmbedderModule');
