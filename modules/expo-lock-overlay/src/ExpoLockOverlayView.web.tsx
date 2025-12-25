import * as React from 'react';

import { ExpoLockOverlayViewProps } from './ExpoLockOverlay.types';

export default function ExpoLockOverlayView(props: ExpoLockOverlayViewProps) {
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
