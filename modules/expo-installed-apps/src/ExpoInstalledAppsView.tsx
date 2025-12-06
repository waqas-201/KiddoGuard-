import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoInstalledAppsViewProps } from './ExpoInstalledApps.types';

const NativeView: React.ComponentType<ExpoInstalledAppsViewProps> =
  requireNativeView('ExpoInstalledApps');

export default function ExpoInstalledAppsView(props: ExpoInstalledAppsViewProps) {
  return <NativeView {...props} />;
}
