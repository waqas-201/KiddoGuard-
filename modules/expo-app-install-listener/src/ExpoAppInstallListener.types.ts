import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};



export type AppInstalledEventPayload = {
  packageName: string;
};

export type ExpoAppInstallListenerModuleEvents = {
  onAppInstalled: (event: AppInstalledEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ExpoAppInstallListenerViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
