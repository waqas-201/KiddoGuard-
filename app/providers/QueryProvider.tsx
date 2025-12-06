import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import React, { PropsWithChildren, useEffect } from "react";
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

export function QueryProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        setupOnlineManager();
        const removeFocus = setupOnlineManager();
        return removeFocus;
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
