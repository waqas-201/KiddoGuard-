import { StartupState } from "@/storage/state/startup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import KidFlowStack from "./KidFlowStack";
import LauncherStack from "./LauncherStack";
import ParentFlowStack from "./ParentFlowStack";
import Tabs from "./TabsNavigator";

export default function AppNavigator({ startup }: { startup: StartupState }) {
    const Stack = createNativeStackNavigator();

    let initialRoute = "ParentFlow";

    if (startup.isParentProfileCompleted) {
        initialRoute = "Tabs";
    }

    if (startup.isDefaultLauncher && startup.isKidProfileCompleted) {
        initialRoute = "LauncherStack";

    }


    if (!startup.isKidProfileCompleted) {
        ``
        initialRoute = "Tabs";
    }

    console.log(initialRoute);

    return (
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
    );
}
