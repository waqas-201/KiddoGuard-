import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TimesUpScreen from '../screens/timesup/TimesUpScreen';

const Stack = createNativeStackNavigator();

export default function TimesUpStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        
            <Stack.Screen name="TimesUpScreen" component={TimesUpScreen} />

             
        </Stack.Navigator>
    );
}
