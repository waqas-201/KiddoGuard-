import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './Timelimit.types';

type TimelimitModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class TimelimitModule extends NativeModule<TimelimitModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(TimelimitModule, 'TimelimitModule');
