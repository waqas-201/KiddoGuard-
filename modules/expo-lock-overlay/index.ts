// Reexport the native module. On web, it will be resolved to ExpoLockOverlayModule.web.ts

import ExpoLockOverlayModule from './src/ExpoLockOverlayModule';

// and on native platforms to ExpoLockOverlayModule.ts
export * from './src/ExpoLockOverlay.types';
export { default } from './src/ExpoLockOverlayModule';
export { default as ExpoLockOverlayView } from './src/ExpoLockOverlayView';


export function startOverlay() {
    return ExpoLockOverlayModule.startOverlay()
}

export function stopOverlay() {
    return ExpoLockOverlayModule.stopOverlay()
}

export function hasOverlayPermission() {
    return ExpoLockOverlayModule.hasOverlayPermission()
}


export function openOverlaySettings() {
    return ExpoLockOverlayModule.openOverlaySettings()
}