import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ActivateLauncherScreen from "../screens/kidflow/ActivateLauncherScreen";
import AddKidScreen from "../screens/kidflow/AddKidScreen";
import KidFaceScan from "../screens/kidflow/KidFaceScan";
import ProfileCreatedScreen from "../screens/kidflow/ProfileCreatedScreen";
import SafeAppsSelection from "../screens/kidflow/SafeAppsSelection";
import SetTimeLimitScreen from "../screens/kidflow/SetTimeLimitScreen";

const Stack = createNativeStackNavigator();

export default function KidFlowStack() {
    return (
        <Stack.Navigator initialRouteName="AddKid" screenOptions={{ headerShown: false }}>
            {/* Add screens in the order of flow */}
            <Stack.Screen name="AddKid" component={AddKidScreen} />
            <Stack.Screen name="SetTimeLimit" component={SetTimeLimitScreen} />
            <Stack.Screen name="KidFaceScan" component={KidFaceScan} />
            <Stack.Screen name="SafeAppsSelection" component={SafeAppsSelection} />
            <Stack.Screen name="ProfileCreatedScreen" component={ProfileCreatedScreen} />
            <Stack.Screen name="ActivateLauncherScreen" component={ActivateLauncherScreen} />



        </Stack.Navigator>
    );
}
