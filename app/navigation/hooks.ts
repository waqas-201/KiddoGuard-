import { useNavigation as useNav } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KidFlowStackParamList, LauncherStackParamList, ParentFlowStackParamList, RootStackParamList, TabsParamList } from "./types";

// Typed hooks for ParentFlow
export const useParentFlowNavigation = () =>
    useNav<NativeStackNavigationProp<ParentFlowStackParamList>>();

// Typed hooks for KidFlow
export const useKidFlowNavigation = () =>
    useNav<NativeStackNavigationProp<KidFlowStackParamList>>();

// Typed hooks for Launcher
export const useLauncherNavigation = () =>
    useNav<NativeStackNavigationProp<LauncherStackParamList>>();

// Typed hooks for Tabs
export const useTabsNavigation = () =>
    useNav<NativeStackNavigationProp<TabsParamList>>();
// Typed hook for RootStack

export const useRootNavigation = () =>
    useNav<NativeStackNavigationProp<RootStackParamList>>();
