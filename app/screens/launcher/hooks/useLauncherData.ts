import { SessionState } from '@/features/sessionSlice';
import { isServiceEnabled } from '@/modules/expo-app-monitor';
import { getAllPackages } from '@/storage/kid';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppItem } from '../../kidflow/SafeAppsSelection';

export function useLauncherData({ role }: { role: string | undefined }) {


    const [apps, setApps] = useState<AppItem[]>([]);
    const [serviceOk, setServiceOk] = useState(false);
    const [ready, setReady] = useState(false);


    useEffect(() => {
        (async () => {
            try {

                const [pkgs, ok] = await Promise.all([

                    getAllPackages(role), // now fetching from DB
                    isServiceEnabled(),
                ]);
                setApps(pkgs);
                setServiceOk(Boolean(ok));
            } catch (error) {
                console.error(error);
            } finally {
                setReady(true);
            }
        })();
    }, []);

    return { apps, serviceOk, ready };
}