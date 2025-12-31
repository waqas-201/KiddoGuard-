import { eq } from "drizzle-orm";
import { createMMKV } from 'react-native-mmkv';
import { db } from '../../db/db';
import { appTable } from '../../db/schema';

const storage = createMMKV();
const CACHE_KEY = 'global_kid_safe_apps';

export const PermissionService = {
    /**
     * Force sync from DB to MMKV. 
     * Call this ONLY when parent saves new app selections.
     */
    forceSync: async () => {
        console.log("🔄 Syncing App Permissions from DB to Cache...");
        const safeApps = await db.select({
            packageName: appTable.packageName
        }).from(appTable).where(eq(appTable.isKidSafe, true));

        const lookup: Record<string, boolean> = {};
        safeApps.forEach(app => {
            lookup[app.packageName] = true;
        });

        storage.set(CACHE_KEY, JSON.stringify(lookup));
        return lookup;
    },

    /**
     * Get allowed apps. If cache is empty, it syncs once.
     * Use this during FaceAuth or Startup.
     */
    ensurePermissionsCached: async () => {
        const cached = storage.getString(CACHE_KEY);
        if (!cached) {
            return await PermissionService.forceSync();
        }
        return JSON.parse(cached);
    },

    /**
     * Instant synchronous check for the listener.
     * No DB, no async/await.
     */
    isAllowed: (packageName: string): boolean => {
        const cached = storage.getString(CACHE_KEY);
        if (!cached) return false;

        // System bypass
        if (packageName === 'com.waqasd.KiddoGuard' || packageName.includes('systemui')) {
            return true;
        }

        const lookup = JSON.parse(cached);
        return !!lookup[packageName];
    }
};