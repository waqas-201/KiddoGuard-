import { db, useDatabaseReady } from "@/db/db";
import { appTable, parentTable } from "@/db/schema";
import { loadStartupState, StartupState } from "@/storage/state/startup";
import { MyTheme } from "@/theme";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./navigation/AppNavigator";
import { QueryProvider } from "./providers/QueryProvider";

export default function App() {
  const [startup, setStartup] = useState<StartupState | null>(null);
  const { success, error } = useDatabaseReady();

  useEffect(() => {
    (async () => {
      const s = await loadStartupState();
      const data = await db.select().from(parentTable)
      const apps = await db.select().from(appTable)




      setStartup(s);
    })();
  }, [success]);

  if (error) {
    return (
      <View>
        <Text>DB Migration Error: {error.message}</Text>
      </View>
    );
  }

  if (!success || !startup) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <PaperProvider theme={MyTheme}>
          <AppNavigator startup={startup} />
        </PaperProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
