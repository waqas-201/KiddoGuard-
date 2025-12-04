import * as React from 'react';

import { ExpoFaceEmbedderViewProps } from './ExpoFaceEmbedder.types';

export default function ExpoFaceEmbedderView(props: ExpoFaceEmbedderViewProps) {
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
