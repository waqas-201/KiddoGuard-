import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoLockOverlayViewProps } from './ExpoLockOverlay.types';

const NativeView: React.ComponentType<ExpoLockOverlayViewProps> =
  requireNativeView('ExpoLockOverlay');

export default function ExpoLockOverlayView(props: ExpoLockOverlayViewProps) {
  return <NativeView {...props} />;
}
