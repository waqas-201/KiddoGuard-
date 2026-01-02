// @/hooks/useAppLifecycleWatcher.ts
import { useEffect } from 'react';
import { addAppInstallListener, addAppUninstallListener } from '../modules/expo-app-install-listener';
import { handleAppUninstalled, handleNewAppInstalled } from '../services/parent/AppDiscoveryService';

export const useAppLifecycleWatcher = () => {
    useEffect(() => {
        // 1. Subscribe to Installs
        const installSub = addAppInstallListener(async (event) => {
            console.log(`[Watcher] Install detected: ${event.packageName}`);
            await handleNewAppInstalled(event.packageName);
        });

        // 2. Subscribe to Uninstalls
        const uninstallSub = addAppUninstallListener(async (event) => {
            console.log(`[Watcher] Uninstall detected: ${event.packageName}`);
            await handleAppUninstalled(event.packageName);
        });

        return () => {
            installSub.remove();
            uninstallSub.remove();
        };
    }, []);
};