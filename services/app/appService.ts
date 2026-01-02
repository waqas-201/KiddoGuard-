// @/db/services/appService.ts
import { eq, sql } from "drizzle-orm";
import { db } from "../../db/db";
import { appTable } from "../../db/schema";

export const AppService = {
    // CREATE / UPDATE (Upsert) - Efficient for bulk syncing installed apps
    upsertApps: async (apps: typeof appTable.$inferInsert[]) => {
        try {
            await db
                .insert(appTable)
                .values(apps)
                .onConflictDoUpdate({
                    target: appTable.packageName,
                    set: {
                        // Use the Drizzle object keys here. 
                        // Drizzle will map "appName" to the correct column automatically.
                        appName: sql`excluded.appName`,
                        icon: sql`excluded.icon`,
                        isKidSafe: sql`excluded.isKidSafe`,
                    },
                }).returning();
        } catch (error) {
            console.error("Error upserting apps:", error);
            throw error;
        }
    },
    // READ - Get all apps
    getAllApps: async () => {
        return await db.select().from(appTable);
    },

    // READ - Get only kid-safe apps
    getKidSafeApps: async () => {
        return await db
            .select()
            .from(appTable)
            .where(eq(appTable.isKidSafe, true));
    },

    // UPDATE - Toggle safety status for a specific app
    updateAppSafety: async (packageName: string, isSafe: boolean) => {
        return await db
            .update(appTable)
            .set({ isKidSafe: isSafe })
            .where(eq(appTable.packageName, packageName));
    },

    // DELETE - Remove an app (e.g., if uninstalled from phone)
    deleteApp: async (packageName: string) => {
        return await db.delete(appTable).where(eq(appTable.packageName, packageName));
    },
};