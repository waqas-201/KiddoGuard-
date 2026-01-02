// @/hooks/useSecurityGuard.ts
import { bringAppToFront, listenOnChange } from "@/modules/expo-app-monitor";
import { PermissionService } from '@/services/kid/PermissionService';
import { useEffect, useRef } from 'react';

export function useSecurityGuard(user: any, isGuardianActive: boolean |undefined) {
    const userRef = useRef(user);
    useEffect(() => { userRef.current = user; }, [user]);

    useEffect(() => {
        // 🛑 Stop here if setup isn't done OR accessibility is off
        if (!isGuardianActive) return;

        console.log("🛡️ Security Guard: ACTIVE (Enforcing FaceAuth/Restrictions)");

        const sub = listenOnChange(async (packageName) => {
            const activeUser = userRef.current;

            // BLOCK 1: THE FACE-AUTH LOCK
            // If no user is authenticated, we don't know who has the phone.
            // Pull them back to the app immediately to prevent bypass.
            if (!activeUser) {
                console.log("🚨 Unauthorized exit attempt. Forcing FaceAuth...");
                return await bringAppToFront();
            }

            // BLOCK 2: THE KID RESTRICTIONS
            if (activeUser?.role === 'child') {
                const isAllowed = PermissionService.isAllowed(packageName);
                if (!isAllowed) {
                    console.log(`🚫 Child blocked from: ${packageName}`);
                    await bringAppToFront();
                }
            }

            // NOTE: If parent, we do nothing. The listener stays active but allows all.
        });

        return () => sub.remove();
    }, [isGuardianActive]);
}