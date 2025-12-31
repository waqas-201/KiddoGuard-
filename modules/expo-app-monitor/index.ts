import ExpoAppMonitorModule from './src/ExpoAppMonitorModule';

export const listenOnChange = (callback: (value: string) => void) => {
    // Standard Expo event listener
    return ExpoAppMonitorModule.addListener('onChange', (event: { value: string }) => {
        callback(event.value);
    });
};

export const isServiceEnabled = async () => {
    return await ExpoAppMonitorModule.isServiceEnabled();
};

export const openAccessibilitySettings = async () => {
    return await ExpoAppMonitorModule.openAccessibilitySettings();
};

// New function for Milestone 2
export const bringAppToFront = async () => {
    return await ExpoAppMonitorModule.bringAppToFront();
};

export const sendTestEvent = async () => {
    return await ExpoAppMonitorModule.setValueAsync();
};