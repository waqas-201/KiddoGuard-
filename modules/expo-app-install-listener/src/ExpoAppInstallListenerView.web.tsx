import * as React from 'react';

import { ExpoAppInstallListenerViewProps } from './ExpoAppInstallListener.types';

export default function ExpoAppInstallListenerView(props: ExpoAppInstallListenerViewProps) {
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
