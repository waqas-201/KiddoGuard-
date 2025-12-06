import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoInstalledApps.types';

type ExpoInstalledAppsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoInstalledAppsModule extends NativeModule<ExpoInstalledAppsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoInstalledAppsModule, 'ExpoInstalledAppsModule');
