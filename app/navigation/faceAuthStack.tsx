import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import FaceAuth from "../screens/faceAuth/faceAuth";


const Stack = createNativeStackNavigator();

export default function FaceAuthStack() {
    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* Add screens in the order of flow */}
            <Stack.Screen name="FaceAuth" component={FaceAuth} />

        </Stack.Navigator>
    );
}
