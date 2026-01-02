import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoAppInstallListenerViewProps } from './ExpoAppInstallListener.types';

const NativeView: React.ComponentType<ExpoAppInstallListenerViewProps> =
  requireNativeView('ExpoAppInstallListener');

export default function ExpoAppInstallListenerView(props: ExpoAppInstallListenerViewProps) {
  return <NativeView {...props} />;
}
