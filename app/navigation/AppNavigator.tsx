import { useDatabaseReady } from "@/db/db";
import { requireReauth, resetSession } from "@/features/sessionSlice";
import { getInstalledApps } from "@/modules/expo-installed-apps";
import { listenScreenState } from "@/modules/expo-screen-check";
import ExpoScreenCheckModule from "@/modules/expo-screen-check/src/ExpoScreenCheckModule";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";
import ActivateLauncherModal from "../components/ActivateLauncherModal";
import FaceAuthStack from "./faceAuthStack";
import KidFlowStack from "./KidFlowStack";
import LauncherStack from "./LauncherStack";
import ParentFlowStack from "./ParentFlowStack";
import { useStartup } from "./StartupContext";
import Tabs from "./TabsNavigator";
import { useNavigationFlow } from "./useNavigationFlow";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { success, error } = useDatabaseReady();
    const { startup, refreshStartup } = useStartup();



    const dispatch = useDispatch();

    useEffect(() => {
        const sub = listenScreenState(async (state) => {
            if (state === "OFF") {
                dispatch(requireReauth());
                dispatch(resetSession());
                await ExpoScreenCheckModule.goToHome()
                await ExpoScreenCheckModule.resetLauncherStack()
            }

            if (state === "ON") {
                console.log("[AUTH] screen on → stopping overlay");

            }
        });

        return () => sub.remove();
    }, []);

    useEffect(() => {
        if (success) refreshStartup();
    }, [success]);





    const flow = useNavigationFlow(startup);

    const showLauncherModal = flow === "SET_APP_AS_DEFAULT_LAUNCHER";
    console.log('show modal  state ', showLauncherModal);


    if (error) return <View><Text>DB Error</Text></View>;
    if (flow === "LOADING") return <View><Text>Loading...</Text></View>;
    console.log('current route is ', flow);

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }} key={flow}>
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
