import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoLauncherViewProps } from './ExpoLauncher.types';

const NativeView: React.ComponentType<ExpoLauncherViewProps> =
  requireNativeView('ExpoLauncher');

export default function ExpoLauncherView(props: ExpoLauncherViewProps) {
  return <NativeView {...props} />;
}
