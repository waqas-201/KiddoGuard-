import { useDatabaseReady } from "@/db/db";
import { resetSession } from "@/features/sessionSlice";
import { listenScreenState } from "@/modules/expo-screen-check";
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
    const { startup, refreshStartup } = useStartup()
    const dispatch = useDispatch()



    useEffect(() => {
        const sub = listenScreenState((state) => {
            if (state === 'OFF') {
                dispatch(resetSession())
                console.log('[AUTH] screen off → reauth required');
            }
        });

        return () => sub.remove();
    }, []);




    useEffect(() => {
        if (success) refreshStartup();
    }, [success]);


    const flow = useNavigationFlow(startup);
    const showLauncherModal = flow === 'SET_APP_AS_DEFAULT_LAUNCHER';


    if (error) return <View><Text>DB Error</Text></View>;
    if (flow === 'LOADING') return <View><Text>Loading...</Text></View>;

    return (<>
        <Stack.Navigator screenOptions={{ headerShown: false }} key={flow}>
            {flow === 'ONBOARDING' && (
                <Stack.Screen name="ParentFlowStack" component={ParentFlowStack} />
            )}

            {flow === 'UNAUTHENTICATED' && (
                <Stack.Screen name="FaceAuth" component={FaceAuthStack} />
            )}

            {flow === 'PARENT_HOME' && (
                <Stack.Screen name="Tabs" component={Tabs} />
            )}

            {flow === 'LAUNCHER' && (
                <Stack.Screen name="LauncherStack" component={LauncherStack} />
            )}

            {/* If KidFlow is a setup screen, it should be part of ONBOARDING or TABS logic */}
            <Stack.Screen name="KidFlow" component={KidFlowStack} />
        </Stack.Navigator>

        <ActivateLauncherModal
            visible={showLauncherModal}
            onClose={refreshStartup}
        />

    </>
    );
}