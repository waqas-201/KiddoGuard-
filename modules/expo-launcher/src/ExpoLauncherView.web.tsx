import * as React from 'react';

import { ExpoLauncherViewProps } from './ExpoLauncher.types';

export default function ExpoLauncherView(props: ExpoLauncherViewProps) {
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
