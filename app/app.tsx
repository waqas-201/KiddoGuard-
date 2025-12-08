import { loadStartupState, StartupState } from "@/storage/state/startup";
import { MyTheme } from "@/theme";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./navigation/AppNavigator";
import { QueryProvider } from "./providers/QueryProvider";

export default function App() {
  const [startup, setStartup] = useState<StartupState | null>(null);


  useEffect(() => {
    (async () => {
      const s = await loadStartupState();
      setStartup(s);
    })();
  }, []);
  // Optionally show a splash screen or loader later !!!!
  if (!startup) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 

    <QueryProvider >
      <PaperProvider theme={MyTheme}>
        <AppNavigator startup={startup} />
      </PaperProvider>
    </QueryProvider>
    </GestureHandlerRootView>
  );
}
