import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LockOverlayScreen from "../components/LockOverlay";


const Stack = createNativeStackNavigator();

export default function LockOverlayStack () {
    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* Add screens in the order of flow */}
            <Stack.Screen name="LockOverlay" component={LockOverlayScreen} />

        </Stack.Navigator>
    );
}
