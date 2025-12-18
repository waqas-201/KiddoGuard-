import { useDatabaseReady } from "@/db/db";
import { loadStartupState, StartupState } from "@/storage/state/startup";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./navigation/AppNavigator";
import { Providers } from "./providers/QueryProvider";

export default function App() {
  const [startup, setStartup] = useState<StartupState | null>(null);
  const { success, error } = useDatabaseReady();

  useEffect(() => {
    (async () => {
      const s = await loadStartupState();
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
      <Providers>
          <AppNavigator startup={startup} />
      </Providers>
    </GestureHandlerRootView>
  );
}
