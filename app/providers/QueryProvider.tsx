import { store } from "@/store";
import { MyTheme } from "@/theme";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import React, { PropsWithChildren, useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { Provider } from 'react-redux';
import { setupOnlineManager } from "../utils/onlineManager";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false, // we handle RN focus manually
        },
    },
});

export function Providers({ children }: PropsWithChildren) {
    useEffect(() => {
        setupOnlineManager();
        const removeFocus = setupOnlineManager();
        return removeFocus;
    }, []);

    return (
        <PaperProvider theme={MyTheme}>

            <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
            </Provider>
        </PaperProvider>
    );
}
