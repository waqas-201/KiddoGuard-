import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoLauncher.types';

type ExpoLauncherModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoLauncherModule extends NativeModule<ExpoLauncherModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoLauncherModule, 'ExpoLauncherModule');
