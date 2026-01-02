import { classification_server_url } from "@/constents/constents";
import { db } from "@/db/db";
import { appTable } from "@/db/schema";
import { getAppIcon, getAppLabel } from "@/modules/expo-installed-apps";
import { eq } from "drizzle-orm";
import { AppService } from "../app/appService";
import { PermissionService } from "../kid/PermissionService";
import { queryClient } from "../queryClient";


export const handleNewAppInstalled = async (packageName: string) => {
    try {
        // 1. EXTRACTION (Parallel execution for speed)
        const [appName, iconBase64] = await Promise.all([
            getAppLabel(packageName),
            getAppIcon(packageName)
        ]);

        console.log(   'new app name from handlenewappisnatalled .............' , appName);
        

        const iconUri = iconBase64 ? `data:image/png;base64,${iconBase64}` : "";

        // 2. PERSISTENCE (Immediate Block)
        // Following your DB structure exactly
         const result =    await AppService.upsertApps([{
            packageName,
            appName: appName || packageName, // Ensure we have something
            icon: iconUri,
            isKidSafe: false
         }]);
        
        
         console.log('insert into sqlite result ' , result);
        queryClient.invalidateQueries({ queryKey: ['launcher-apps' ] });
        

        // Sync MMKV instantly so the kid is blocked
        await PermissionService.forceSync();

        // 3. CLASSIFICATION (Background)
        const response = await fetch(`${classification_server_url}/api/check`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                appNames: [{ packageName, appName }]
            })
        });

        const data = await response.json();
        const classification = data?.apps?.find((a: any) => a.packageName === packageName);

        if (classification?.isKidSafe) {
            // 4. RESOLUTION: Unlock if safe
            await AppService.updateAppSafety(packageName, true);
            await PermissionService.forceSync();
            console.log(`[Watcher] ${appName} auto-allowed by AI.`);
        }

    } catch (error) {
        console.error(`[Watcher] Failed to process install for ${packageName}:`, error);
    }
};





export const handleAppUninstalled = async (packageName: string) => {
    try {
        console.log(`[Watcher] Cleaning up DB for: ${packageName}`);

        // 1. Delete from SQLite
        await db.delete(appTable).where(eq(appTable.packageName, packageName));

        // 2. Invalidate UI Cache
        // This triggers your useQuery() in the Launcher to re-fetch from DB
        await queryClient.invalidateQueries({ queryKey: ['launcher-apps'] });

        // 3. Sync Permissions
        // Important: Clears the "Allowed" status from memory/MMKV
        await PermissionService.forceSync();

        console.log(`[Watcher] Cleanup successful.`);
    } catch (error) {
        console.error(`[Watcher] Failed to clean up ${packageName}:`, error);
    }
};