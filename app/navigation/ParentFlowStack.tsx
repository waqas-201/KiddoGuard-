import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import NameGenderScreen from "../screens/parentflow/NameAndGenderSetup";
import OnboardingScreen from "../screens/parentflow/OnboardingScreen";
import ParentProfileScreen from "../screens/parentflow/ParentProfile";
import SaveParentProfileScreen from "../screens/parentflow/SaveParentProfileScreen";
import SecureAccountSetup from "../screens/parentflow/SecureAccountSetup";


const Stack = createNativeStackNavigator();

export default function ParentFlowStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Add screens in the order of flow */}
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="ParentProfile" component={ParentProfileScreen} />
            <Stack.Screen name="NameAndGenderScreen" component={NameGenderScreen} />
            <Stack.Screen name="SecureAccountSetup" component={SecureAccountSetup} />
            <Stack.Screen name="SaveParentProfileScreen" component={SaveParentProfileScreen} />
            
        </Stack.Navigator>
    );
}
