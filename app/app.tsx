import React from "react";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./navigation/AppNavigator";
import { MyTheme } from "@/theme";


export default function App() {
  return (
    // <QueryProvider>
      <PaperProvider theme={MyTheme}>
        <AppNavigator />
      </PaperProvider>
    // </QueryProvider>
  );
}
