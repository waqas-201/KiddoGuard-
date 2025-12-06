import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

export function setupOnlineManager() {
    onlineManager.setEventListener((setOnline) => {
        const subscription = Network.addNetworkStateListener((state) => {
            setOnline(!!state.isConnected);
        });

        return () => subscription.remove();
    });
}
