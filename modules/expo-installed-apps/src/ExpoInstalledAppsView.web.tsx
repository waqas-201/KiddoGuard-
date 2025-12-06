import * as React from 'react';

import { ExpoInstalledAppsViewProps } from './ExpoInstalledApps.types';

export default function ExpoInstalledAppsView(props: ExpoInstalledAppsViewProps) {
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
