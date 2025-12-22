import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoScreenCheckViewProps } from './ExpoScreenCheck.types';

const NativeView: React.ComponentType<ExpoScreenCheckViewProps> =
  requireNativeView('ExpoScreenCheck');

export default function ExpoScreenCheckView(props: ExpoScreenCheckViewProps) {
  return <NativeView {...props} />;
}
