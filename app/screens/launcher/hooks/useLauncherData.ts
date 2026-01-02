// @/hooks/useLauncherData.ts
import { isServiceEnabled } from '@/modules/expo-app-monitor';
import { getAllPackages } from '@/storage/kid';
import { useQuery } from '@tanstack/react-query';

export function useLauncherData({ role }: { role: string | undefined }) {
    // This query is now managed by TanStack Query
    const { data: apps = [], isLoading: appsLoading } = useQuery({
        queryKey: ['launcher-apps', role], // The "ID" of this data
        queryFn: () => getAllPackages(role)
    });

    const { data: serviceOk = false, isLoading: serviceLoading } = useQuery({
        queryKey: ['accessibility-service'],
        queryFn: () => isServiceEnabled(),
    });

    return {
        apps,
        serviceOk,
        ready: !appsLoading && !serviceLoading
    };
}