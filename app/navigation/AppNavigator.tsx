// @/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// State & Logic
import { db, useDatabaseReady } from "@/db/db";
import { setTimeExhausted } from "@/features/restrictionSlice";
import { requireReauth, resetSession } from "@/features/sessionSlice";
import { RootState } from "@/store";
import { useStartup } from "./StartupContext";
import { useNavigationFlow } from "./useNavigationFlow";

// Modules & Services
import { isServiceEnabled } from "@/modules/expo-app-monitor";
import { listenScreenState } from "@/modules/expo-screen-check";
import TimelimitModule from "@/modules/expo-TimeLimit/src/TimelimitModule";
import { handleTimeExpiration, stopAndSaveChildTimer } from "@/services/timeLimit/timeSync";

// Hooks & Components
import { useAppLifecycleWatcher } from "@/hooks/useAppInstallWatcher";
import { AccessibilityGuard } from "../components/AccessibilityGuard";
import ActivateLauncherModal from "../components/ActivateLauncherModal";

// Stacks
import { appTable } from "@/db/schema";
import { useSecurityGuard } from "@/hooks/useSecurityGuard";
import FaceAuthStack from "./faceAuthStack";
import KidFlowStack from "./KidFlowStack";
import LauncherStack from "./LauncherStack";
import ParentFlowStack from "./ParentFlowStack";
import Tabs from "./TabsNavigator";
import TimesUpStack from "./TImesUpStack";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const dispatch = useDispatch();
    const { success, error } = useDatabaseReady();
    const { startup, refreshStartup } = useStartup();
    const user = useSelector((state: RootState) => state.session.currentUser);
    const flow = useNavigationFlow(startup);

    // --- MILESTONE 1: Setup Status ---
    const isSetupComplete = startup?.isDefaultLauncher && startup.isParentProfileCompleted && startup.isKidProfileCompleted as boolean

    // --- MILESTONE 2: Accessibility Status ---
    const [isAccessOn, setIsAccessOn] = useState(false);

    useEffect(() => {
        if (!isSetupComplete) return;
        const check = async () => setIsAccessOn(await isServiceEnabled());
        check();
        const sub = AppState.addEventListener("change", (s) => s === "active" && check());
        return () => sub.remove();
    }, [isSetupComplete]);

    // --- MILESTONE 3: Guardian Logic ---
    // Monitoring only starts if Setup is Done AND Permission is Granted
    useAppLifecycleWatcher(); // Always runs (Installs/Uninstalls)
    useSecurityGuard(user, isSetupComplete && isAccessOn);

    // --- MILESTONE 4: Screen/Timer Listeners ---
    useEffect(() => {
        const sub = listenScreenState(async (state) => {

            const apps = await db.select().from(appTable)

            console.log(apps.length);


            if (state === "OFF") {
                if (user?.role === 'child') await stopAndSaveChildTimer(user.id);
                dispatch(requireReauth());
                dispatch(resetSession());
            }
        });
        return () => sub.remove();
    }, [user]);

    useEffect(() => {
        const expireSub = TimelimitModule.addListener('onTimeExpired', async () => {
            if (user?.role === "child") {
                await handleTimeExpiration(user.id);
                dispatch(setTimeExhausted(true));
                dispatch(requireReauth());
                dispatch(resetSession());
            }
        });
        return () => expireSub.remove();
    }, [user]);

    useEffect(() => { if (success) refreshStartup(); }, [success]);

    if (error) return <View style={styles.center}><Text>DB Error</Text></View>;
    if (flow === "LOADING") return <View style={styles.center}><Text>Loading...</Text></View>;

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }} key={flow}>
                {flow === 'TIMES_UP' && <Stack.Screen name="TimesUpStack" component={TimesUpStack} />}
                {flow === "ONBOARDING" && <Stack.Screen name="ParentFlowStack" component={ParentFlowStack} />}
                {flow === "LAUNCHER" && <Stack.Screen name="LauncherStack" component={LauncherStack} />}
                {flow === "UNAUTHENTICATED" && <Stack.Screen name="FaceAuth" component={FaceAuthStack} />}
                {flow === "PARENT_HOME" && <Stack.Screen name="Tabs" component={Tabs} />}
                <Stack.Screen name="KidFlow" component={KidFlowStack} />
            </Stack.Navigator>

            <ActivateLauncherModal
                visible={flow === "SET_APP_AS_DEFAULT_LAUNCHER"}
                onClose={refreshStartup}
            />

            <AccessibilityGuard isSetupComplete={isSetupComplete} />
        </>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});