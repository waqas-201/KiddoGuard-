import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./navigation/AppNavigator";
import { Providers } from "./providers/QueryProvider";

export default function App() {


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <Providers>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Providers>
    </GestureHandlerRootView>
  );
}

