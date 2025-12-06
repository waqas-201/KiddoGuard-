import * as React from 'react';

import { ExpoAppMonitorViewProps } from './ExpoAppMonitor.types';

export default function ExpoAppMonitorView(props: ExpoAppMonitorViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
