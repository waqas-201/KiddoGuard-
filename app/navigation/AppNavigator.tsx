import { useDatabaseReady } from "@/db/db";
import { setTimeExhausted } from "@/features/restrictionSlice";
import { requireReauth, resetSession } from "@/features/sessionSlice";
import { listenScreenState } from "@/modules/expo-screen-check";
import ExpoScreenCheckModule from "@/modules/expo-screen-check/src/ExpoScreenCheckModule";
import TimelimitModule from "@/modules/expo-TimeLimit/src/TimelimitModule";
import { handleTimeExpiration, stopAndSaveChildTimer } from "@/services/timeLimit/timeSync";
import { RootState } from "@/store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ActivateLauncherModal from "../components/ActivateLauncherModal";
import FaceAuthStack from "./faceAuthStack";
import KidFlowStack from "./KidFlowStack";
import LauncherStack from "./LauncherStack";
import ParentFlowStack from "./ParentFlowStack";
import { useStartup } from "./StartupContext";
import Tabs from "./TabsNavigator";
import TimesUpStack from "./TImesUpStack";
import { useNavigationFlow } from "./useNavigationFlow";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { success, error } = useDatabaseReady();
    const { startup, refreshStartup } = useStartup();
    const user = useSelector((state: RootState) => state.session.currentUser)
    const userRef = useRef(user); // Keep a reference that the listener can always see
    const dispatch = useDispatch();

    useEffect(() => {
        userRef.current = user; // Update ref whenever user changes
    }, [user]);



    useEffect(() => {
        const sub = listenScreenState(async (state) => {
            if (state === "OFF") {
                const currentUser = userRef.current; // Use the REF, not the state variable

                if (currentUser?.role === 'child') {
                    console.log("[Sync] Screen OFF: Saving for child", currentUser.id);
                    // 1. SAVE FIRST
                    await stopAndSaveChildTimer(currentUser.id);
                }

                // 2. RESET AFTER SAVING
                dispatch(requireReauth());
                dispatch(resetSession());

                await ExpoScreenCheckModule.goToHome();
                await ExpoScreenCheckModule.resetLauncherStack();
            }
        });

        return () => sub.remove();
    }, [dispatch]); // Removed user from dependency to keep the listener stable
    useEffect(() => {
        if (success) refreshStartup();
    }, [success]);


    useEffect(() => {


        // 2. THE NEW TIMER EXPIRATION LISTENER
        const expireSub = TimelimitModule.addListener('onTimeExpired', async () => {
            console.log('time endded we got here ');

            if (user?.role === "child") {
                // A. Run the DB finalizer
                await handleTimeExpiration(user.id);
                // B. Boot them out (Clear Redux and Navigate)
                dispatch(setTimeExhausted(true))
                dispatch(requireReauth());
                dispatch(resetSession());


            }
        });

        return () => {
            expireSub.remove();
        };
    }, []);



    const flow = useNavigationFlow(startup);

    const showLauncherModal = flow === "SET_APP_AS_DEFAULT_LAUNCHER";
    console.log('show modal  state ', showLauncherModal);


    if (error) return <View><Text>DB Error</Text></View>;
    if (flow === "LOADING") return <View><Text>Loading...</Text></View>;
    console.log('current route is ', flow);

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }} key={flow}>


                {flow === 'TIMES_UP' && (
                    <Stack.Screen name="TimesUpStack" component={TimesUpStack} />
                )} 

                {flow === "ONBOARDING" && (
                    <Stack.Screen name="ParentFlowStack" component={ParentFlowStack} />
                )}

                {flow === "LAUNCHER" && (
                    <Stack.Screen name="LauncherStack" component={LauncherStack} />
                )}
                {flow === "UNAUTHENTICATED" && (
                    <Stack.Screen name="FaceAuth" component={FaceAuthStack} />
                )}

                {flow === "PARENT_HOME" && (
                    <Stack.Screen name="Tabs" component={Tabs} />
                )}


                <Stack.Screen name="KidFlow" component={KidFlowStack} />
            </Stack.Navigator>

            <ActivateLauncherModal
                visible={showLauncherModal}
                onClose={refreshStartup}
            />
        </>
    );
}
