import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SecretGestureWrapper } from "../components/SecretGestureWrapper";
import FaceAuth from "../screens/faceAuth/faceAuth";


const Stack = createNativeStackNavigator();

export default function FaceAuthStack() {




    return (
        <SecretGestureWrapper>

        <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* Add screens in the order of flow */}
            <Stack.Screen name="FaceAuth" component={FaceAuth} />

        </Stack.Navigator>
        </SecretGestureWrapper>
    );
}
