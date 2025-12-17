import { AppItem } from "@/app/screens/kidflow/SafeAppsSelection";
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


export async function getAllPackages(): Promise<AppItem[]> {
    try {
        const rows = await db.select().from(appTable);
        // Map database rows to AppItem, convert null versionName to undefined
        return rows.map(row => ({
            packageName: row.packageName,
            appName: row.appName,
            isKidSafe: row.isKidSafe,
            icon: row.icon,
        }));
    } catch (error) {
        console.error("Failed to get kid safe packages:", error);
        return [];
    }
}
