import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { StartupState } from "./startup";

// hooks/useNavigationFlow.ts
export type AppFlow = 'LOADING' | 'ONBOARDING' | 'UNAUTHENTICATED' | 'PARENT_HOME' | 'LAUNCHER' | 'SET_APP_AS_DEFAULT_LAUNCHER' | 'SHOW_KID_FLOW';

export function useNavigationFlow(startup: StartupState | null) {


    const session = useSelector((state: RootState) => state.session)



    // 1. App is still initializing DB/Storage
    if (!startup) return 'LOADING';
    // when device locked 
    if (session.requireReauth) return 'LOCKED';

    // 2. Rule: First time load / Setup not done
    if (!startup.isParentProfileCompleted) return 'ONBOARDING';

    // 3. Rule: If not authenticated, always show FaceAuth
    if (!session.currentUser && startup.isParentProfileCompleted) return 'UNAUTHENTICATED';


    // 4. Rule: If user is a Child, they ONLY see the Launcher
    if (session.currentUser?.role === "child" && startup.isKidProfileCompleted && startup.isDefaultLauncher) return 'LAUNCHER';

    if (session.currentUser?.role === "child" && startup.isKidProfileCompleted && !startup.isDefaultLauncher) return 'SET_APP_AS_DEFAULT_LAUNCHER'
    // 5. Rule: If user is a Parent
    if (session.currentUser?.role === "parent") {
        // If app is the default launcher AND kid setup is done, Parent also goes to Launcher
        if (startup.isKidProfileCompleted && startup.isDefaultLauncher) {
            return 'LAUNCHER';
        }
        // Otherwise (Initial setup phase), Parent goes to Tabs to manage settings
        return 'PARENT_HOME';
    }

    return 'UNAUTHENTICATED';
}