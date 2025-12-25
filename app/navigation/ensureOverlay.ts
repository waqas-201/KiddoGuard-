import { hasOverlayPermission, openOverlaySettings } from '@/modules/expo-lock-overlay';
import { Alert } from 'react-native';

export async function ensureOverlay() {
    const granted = await hasOverlayPermission();
    if (!granted) {
        Alert.alert(
            "Overlay Permission Required",
            "This app needs permission to display overlays. Please enable it in the settings.",
            [
                {
                    text: "Open Settings",
                    onPress: () => openOverlaySettings(),
                }
            ]
        );
        return false;
    }
    return true;
}
