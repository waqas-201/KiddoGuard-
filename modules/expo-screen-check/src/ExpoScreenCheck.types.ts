import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type ScreenState = 'ON' | 'OFF' | 'UNLOCK';


export type ExpoScreenCheckModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onScreenState: (event: { state: ScreenState }) => void;

};

export type ChangeEventPayload = {
  value: string;
};

export type ExpoScreenCheckViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
