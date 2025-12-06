import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoAppMonitorViewProps } from './ExpoAppMonitor.types';

const NativeView: React.ComponentType<ExpoAppMonitorViewProps> =
  requireNativeView('ExpoAppMonitor');

export default function ExpoAppMonitorView(props: ExpoAppMonitorViewProps) {
  return <NativeView {...props} />;
}
