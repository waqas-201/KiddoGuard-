import { AppItem } from '@/app/screens/kidflow/SafeAppsSelection';
import { db } from '@/db/db';
import { appTable } from '@/db/schema';
import { createMMKV } from "react-native-mmkv";

export const kidDraft = createMMKV({
    id: 'kid-draft',
    readOnly: false
})





export const kidSafeAppsStore = createMMKV({
    id: 'kid-safe-apps-store',
    readOnly: false
})  




export function saveKidSafePackages(packages: AppItem[]) {
    kidSafeAppsStore.set("kidSafePackages", JSON.stringify(packages));
}

export function getKidSafePackages(): AppItem[] {
    const raw = kidSafeAppsStore.getString("kidSafePackages");
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export type roleType = {
    role: "parent" | "child"
}
export async function getAllPackages(role: string | undefined): Promise<AppItem[] | []> {


    try {
        const rows = await db.select().from(appTable);

        const apps = rows.map(row => ({
            packageName: row.packageName,
            appName: row.appName,
            isKidSafe: row.isKidSafe,
            icon: row.icon,
        }));
        const kidApps = apps.filter(((app) => app.isKidSafe === true))

        if (!role) return []
        if (role === 'child') {
            return kidApps
        } else {
            return apps
        }



        // Map database rows to AppItem, convert null versionName to undefined
    } catch (error) {
        console.error("Failed to get kid safe packages:", error);
        return [];
    }
}
