// app/navigation/types.ts

// ParentFlow stack
export type ParentFlowStackParamList = {
    Onboarding: undefined;
    NameAndGenderScreen: undefined;
    SecureAccountSetup: undefined;
    ParentProfile: undefined;
    SaveParentProfileScreen: undefined
};

// KidFlow stack
export type KidFlowStackParamList = {
    AddKid: undefined;
    Congrats: undefined;
    SafeAppsSelection: undefined;
    SetTimeLimit: undefined;
    KidFaceScan: undefined;
    ProfileCreatedScreen: undefined;
    ActivateLauncherScreen: undefined
};

// Launcher stack
export type LauncherStackParamList = {
    KidSafeLauncherScreen: undefined;
};

// Tabs
export type TabsParamList = {
    KidsTab: undefined;
    SettingsTab: undefined;
};


export type FaceAuthParamsList = {
    FaceAuth: undefined
}


export type LockOverLayParamsList = {
    LockOverlay: undefined
}

// Root stack (AppNavigator)
export type RootStackParamList = {
    ParentFlow: undefined; // No params
    Tabs: { screen?: keyof TabsParamList } | undefined; // Nested tabs
    KidFlow: { screen?: keyof KidFlowStackParamList } | undefined; // Nested KidFlow
};



