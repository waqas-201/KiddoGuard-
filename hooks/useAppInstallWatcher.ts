// @/hooks/useAppInstallWatcher.ts

import { useEffect } from 'react';
import { addAppInstallListener } from '../modules/expo-app-install-listener';
import { handleNewAppInstalled } from '../services/parent/AppDiscoveryService';

export const useAppInstallWatcher = () => {
    useEffect(() => {
        // Subscribe to the native event
        const subscription = addAppInstallListener(async (event) => {
            console.log(`[Watcher] New package detected: ${event.packageName}`);

            try {
                // Call the service that handles DB + AI Classification
              const result =   await handleNewAppInstalled(event.packageName);
              console.log(   'handle app installed result ',    result);
              
            } catch (error) {
                console.error(`[Watcher] Error processing ${event.packageName}:`, error);
            }
        });

        // Cleanup on unmount
        return () => {
            subscription.remove();
        };
    }, []);
};