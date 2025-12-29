import { requireNativeView } from 'expo';
import * as React from 'react';

import { TimelimitViewProps } from './Timelimit.types';

const NativeView: React.ComponentType<TimelimitViewProps> =
  requireNativeView('Timelimit');

export default function TimelimitView(props: TimelimitViewProps) {
  return <NativeView {...props} />;
}
