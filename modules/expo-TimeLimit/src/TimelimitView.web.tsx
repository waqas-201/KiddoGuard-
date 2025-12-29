import * as React from 'react';

import { TimelimitViewProps } from './Timelimit.types';

export default function TimelimitView(props: TimelimitViewProps) {
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
