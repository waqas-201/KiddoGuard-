// Reexport the native module. On web, it will be resolved to ExpoScreenCheckModule.web.ts

import { ScreenState } from './src/ExpoScreenCheck.types';
import ExpoScreenCheckModule from './src/ExpoScreenCheckModule';

// and on native platforms to ExpoScreenCheckModule.ts
export * from './src/ExpoScreenCheck.types';
export { default } from './src/ExpoScreenCheckModule';
export { default as ExpoScreenCheckView } from './src/ExpoScreenCheckView';

/**
 * Subscribe to screen state changes
 * @param callback Receives the current screen state ('ON' | 'OFF' | 'UNLOCK')
 * @returns subscription object with `.remove()` to unsubscribe
 */
export const listenScreenState = (callback: (state: ScreenState) => void) => {
    const sub = ExpoScreenCheckModule.addListener('onScreenState', (event: { state: ScreenState }) => {
        callback(event.state);
    });
    return sub; // call sub.remove() when cleaning up
};
