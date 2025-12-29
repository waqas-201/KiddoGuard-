import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type TimelimitModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onTimeExpired: () => void;

};

export type ChangeEventPayload = {
  value: string;
};

export type TimelimitViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
