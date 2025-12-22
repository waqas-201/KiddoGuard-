import React, { createContext, useContext, useState } from "react";
import { loadStartupState, StartupState } from "./startup";

type StartupContextType = {
    startup: StartupState | null;
    refreshStartup: () => Promise<void>;
};

const StartupContext = createContext<StartupContextType | undefined>(undefined);

export const StartupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [startup, setStartup] = useState<StartupState | null>(null);

    const refreshStartup = async () => {

        console.log('refresh startup called ');

        const s = await loadStartupState();
        setStartup(s);
    };

    return (
        <StartupContext.Provider value={{ startup, refreshStartup }}>
            {children}
        </StartupContext.Provider>
    );
};

export const useStartup = () => {
    const ctx = useContext(StartupContext);
    if (!ctx) throw new Error("useStartup must be used inside StartupProvider");
    return ctx;
};
