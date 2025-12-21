import { StartupState } from "@/storage/state/startup";

// hooks/useNavigationFlow.ts
export type AppFlow = 'LOADING' | 'ONBOARDING' | 'UNAUTHENTICATED' | 'PARENT_HOME' | 'LAUNCHER';

export function useNavigationFlow(startup: StartupState | null, user: any) {
    // 1. App is still initializing DB/Storage
    if (!startup) return 'LOADING';

    // 2. Rule: First time load / Setup not done
    if (!startup.isParentProfileCompleted) return 'ONBOARDING';

    // 3. Rule: If not authenticated, always show FaceAuth
    if (!user) return 'UNAUTHENTICATED';

    // 4. Rule: If user is a Child, they ONLY see the Launcher
    if (user.role === "child") return 'LAUNCHER';

    // 5. Rule: If user is a Parent
    if (user.role === "parent") {
        // If app is the default launcher AND kid setup is done, Parent also goes to Launcher
        if (startup.isKidProfileCompleted && startup.isDefaultLauncher) {
            return 'LAUNCHER';
        }
        // Otherwise (Initial setup phase), Parent goes to Tabs to manage settings
        return 'PARENT_HOME';
    }

    return 'UNAUTHENTICATED';
}