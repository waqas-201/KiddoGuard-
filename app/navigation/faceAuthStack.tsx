import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import KidSafeLauncherScreen from "../screens/launcher/LauncherHomeScreen";


const Stack = createNativeStackNavigator();

export default function FaceAuthStack() {
    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* Add screens in the order of flow */}
            <Stack.Screen name="KidSafeLauncherScreen" component={KidSafeLauncherScreen} />

        </Stack.Navigator>
    );
}
