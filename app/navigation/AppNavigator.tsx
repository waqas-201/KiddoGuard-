// app/navigation/AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import ParentFlowStack from "./ParentFlowStack";
import Tabs from "./TabsNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* You can conditionally show flows later based on auth, role, etc. */}
                <Stack.Screen name="ParentFlow" component={ParentFlowStack} />
                <Stack.Screen name ="Tabs" component={Tabs}/>
              
            </Stack.Navigator>
        </NavigationContainer>
    );
}
