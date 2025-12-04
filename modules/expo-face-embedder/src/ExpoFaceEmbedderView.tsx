import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoFaceEmbedderViewProps } from './ExpoFaceEmbedder.types';

const NativeView: React.ComponentType<ExpoFaceEmbedderViewProps> =
  requireNativeView('ExpoFaceEmbedder');

export default function ExpoFaceEmbedderView(props: ExpoFaceEmbedderViewProps) {
  return <NativeView {...props} />;
}
