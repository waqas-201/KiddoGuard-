import * as React from 'react';

import { ExpoScreenCheckViewProps } from './ExpoScreenCheck.types';

export default function ExpoScreenCheckView(props: ExpoScreenCheckViewProps) {
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
