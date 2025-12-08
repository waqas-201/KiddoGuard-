import { StartupState } from "@/storage/state/startup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import ActivateLauncherModal from "../components/ActivateLauncherModal";
import KidFlowStack from "./KidFlowStack";
import LauncherStack from "./LauncherStack";
import ParentFlowStack from "./ParentFlowStack";
import Tabs from "./TabsNavigator";

export default function AppNavigator({ startup }: { startup: StartupState }) {
    const Stack = createNativeStackNavigator();



    const [showLauncherModal, setShowLauncherModal] = useState(false);



    useEffect(() => {
        // Show modal on app load if kid profile is done but launcher isn't active
        if (startup.isKidProfileCompleted && !startup.isDefaultLauncher) {
            setShowLauncherModal(true);
        }
    }, [startup]);




    let initialRoute = "ParentFlow";

    if (startup.isParentProfileCompleted) {
        initialRoute = "Tabs";
    }

    if (startup.isDefaultLauncher && startup.isKidProfileCompleted) {
        initialRoute = "LauncherStack";

    }

    if (!startup.isKidProfileCompleted) {
        initialRoute = "Tabs";
    }

    console.log(initialRoute);

    return (
        <>
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="ParentFlow" component={ParentFlowStack} />
                <Stack.Screen name="KidFlow" component={KidFlowStack} />
                <Stack.Screen name="LauncherStack" component={LauncherStack} />
                <Stack.Screen name="Tabs" component={Tabs} />
            </Stack.Navigator>
        </NavigationContainer>

            {/* GLOBAL MODAL */}
            <ActivateLauncherModal
                visible={showLauncherModal}
                onClose={() => setShowLauncherModal(false)}
            />
        </>
    );
}
