import { StartupState } from "@/storage/state/startup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import ActivateLauncherModal from "../components/ActivateLauncherModal";
import FaceAuth from "../screens/faceAuth/faceAuth";
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


    let initialRoute: string;

    if (!startup.isParentProfileCompleted) {  // false !false = true so false become true then we set inittial it mean yes parent profile is not completed 
        initialRoute = "ParentFlow";
    } else if (!startup.isKidProfileCompleted) { // same here 
        initialRoute = "Tabs"; // kid setup
    } else if (startup.isDefaultLauncher && startup.isKidProfileCompleted) {  // when both true 
        initialRoute = "LauncherStack";
    } else {
        initialRoute = "Tabs";   // if none of above meet 
    }

    console.log('initial route is ==', initialRoute);

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
                    <Stack.Screen name="FaceAuth" component={FaceAuth} /> 
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
