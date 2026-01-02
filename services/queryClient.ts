import { QueryClient } from "@tanstack/react-query";

// Create the single instance that the whole app will share
// @/services/queryClient.ts

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 1. Never mark data as old automatically
            staleTime: Infinity,

            // 2. Disable all "Smart" background triggers
            refetchOnWindowFocus: false, // Don't refetch when app is reopened
            refetchOnMount: false,       // Don't refetch when navigating back to screen
            refetchOnReconnect: false,   // Don't refetch when internet comes back
        },
    },
});