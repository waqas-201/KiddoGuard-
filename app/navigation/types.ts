// app/navigation/types.ts

// ParentFlow stack
export type ParentFlowStackParamList = {
    Onboarding: undefined;
    NameAndGenderScreen: undefined;
    SecureAccountSetup: undefined;
    ParentProfile: undefined;
};

// KidFlow stack
export type KidFlowStackParamList = {
    AddKid: undefined;
    Congrats: undefined;
    SafeAppsSelection: undefined;
    SetTimeLimit: undefined;
};

// Launcher stack
export type LauncherStackParamList = {
    LauncherHome: undefined;
};

// Tabs
export type TabsParamList = {
    KidsTab: undefined;
    SettingsTab: undefined;
};
