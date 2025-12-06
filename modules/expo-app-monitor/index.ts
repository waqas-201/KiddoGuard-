// modules/expo-app-monitor.ts
import ExpoAppMonitorModule from './src/ExpoAppMonitorModule';

export const listenOnChange = (callback: (value: string) => void) => {
    const sub = ExpoAppMonitorModule.addListener('onChange', (event: any) => {
        callback(event.value);
    });
    return sub; // call sub.remove() when cleaning up
};

export const sendTestEvent = () => ExpoAppMonitorModule.setValueAsync();
export const isServiceEnabled = () => ExpoAppMonitorModule.isServiceEnabled();
