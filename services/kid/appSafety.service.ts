import { Platform } from "react-native";
import { classification_server_url } from "../../constents/constents";
import { db } from "../../db/db";
import { appTable } from "../../db/schema";
import { getAppIcon, getInstalledApps } from '../../modules/expo-installed-apps';

export interface AppItem {
    packageName: string;
    appName: string;
    versionName?: string;
    icon: string;
    isKidSafe?: boolean;
}

export const AppSafetyService = {
    /** * Scans Android for installed apps and retrieves their icons 
     */
    async fetchInstalledApps(onProgress: (p: number) => void): Promise<AppItem[]> {
        if (Platform.OS !== "android") return [];

        const rawApps = JSON.parse(await getInstalledApps());
        const total = rawApps.length;

        const processedApps: AppItem[] = [];

        for (let i = 0; i < total; i++) {
            const app = rawApps[i];
            try {
                const iconBase64 = await getAppIcon(app.packageName);
                processedApps.push({
                    ...app,
                    icon: iconBase64 ? `data:image/png;base64,${iconBase64}` : ""
                });
            } catch (e) {
                processedApps.push({ ...app, icon: "" });
            }
            onProgress(0.35 + (i / total) * 0.35); // Update progress during icon fetching
        }
        return processedApps;
    },

    /** * Sends app list to your server for safety classification 
     */
    async classifyApps(apps: AppItem[]) {
        const response = await fetch(`${classification_server_url}/api/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                appNames: apps.map(a => ({ packageName: a.packageName, appName: a.appName }))
            }),
        });

        if (!response.ok) throw new Error("Classification API failed");
        const data = await response.json();
        return data?.apps; // Expects array: { packageName: string, isKidSafe: boolean }
    },

    /** * Persists apps to the database, avoiding duplicates 
     */
    async saveAppsToDatabase(apps: AppItem[]) {
        const existingApps = await db.select({ pkg: appTable.packageName }).from(appTable);
        const existingSet = new Set(existingApps.map(row => row.pkg));

        const newApps = apps.filter(app => !existingSet.has(app.packageName));
        if (newApps.length === 0) return;

        await db.insert(appTable).values(
            newApps.map(app => ({
                packageName: app.packageName,
                appName: app.appName,
                versionName: app.versionName ?? null,
                icon: app.icon,
                isKidSafe: !!app.isKidSafe,
            }))
        );
    }
};