import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

// This payload is shared by both Install and Uninstall events
export type AppInstalledEventPayload = {
  packageName: string;
};

// Update this interface to include the removal event
export type ExpoAppInstallListenerModuleEvents = {
  onAppInstalled: (event: AppInstalledEventPayload) => void;
  onAppRemoved: (event: AppInstalledEventPayload) => void; // 👈 Add this
};

export type ChangeEventPayload = {
  value: string;
};

export type ExpoAppInstallListenerViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};