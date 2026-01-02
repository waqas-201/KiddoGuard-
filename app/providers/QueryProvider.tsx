import { queryClient } from "@/services/queryClient";
import { store } from "@/store";
import { MyTheme } from "@/theme";
import {
    QueryClientProvider
} from "@tanstack/react-query";
import React, { PropsWithChildren, useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { Provider } from 'react-redux';
import { StartupProvider } from "../navigation/StartupContext";
import { setupOnlineManager } from "../utils/onlineManager";



export function Providers({ children }: PropsWithChildren) {
    useEffect(() => {
        setupOnlineManager();
        const removeFocus = setupOnlineManager();
        return removeFocus;
    }, []);

    return (
        <PaperProvider theme={MyTheme}>
            <StartupProvider>
            <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
            </Provider>
            </StartupProvider>
        </PaperProvider>
    );
}
