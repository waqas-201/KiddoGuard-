
import { isServiceEnabled } from '@/modules/expo-app-monitor';
import { getKidSafePackages } from '@/storage/kid';
import { useEffect, useState } from 'react';
import { AppItem } from '../../kidflow/SafeAppsSelection';

export function useLauncherData() {
    const [apps, setApps] = useState<AppItem[]>([]);
    const [serviceOk, setServiceOk] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            const [pkgs, ok] = await Promise.all([
                getKidSafePackages(),
                isServiceEnabled(),
            ]);
            setApps(pkgs);
            setServiceOk(Boolean(ok));
            setReady(true);
        })();
    }, []);

    return { apps, serviceOk, ready };
}