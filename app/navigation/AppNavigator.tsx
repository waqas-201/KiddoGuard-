// import { useDatabaseReady } from "@/db/db";
// import { setTimeExhausted } from "@/features/restrictionSlice";
// import { requireReauth, resetSession } from "@/features/sessionSlice";
// import { isServiceEnabled, listenOnChange } from "@/modules/expo-app-monitor";
// import { listenScreenState } from "@/modules/expo-screen-check";
// import TimelimitModule from "@/modules/expo-TimeLimit/src/TimelimitModule";
// import { handleTimeExpiration, stopAndSaveChildTimer } from "@/services/timeLimit/timeSync";
// import { RootState } from "@/store";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { useEffect, useRef, useState } from "react";
// import { AppState, Text, View } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import ActivateLauncherModal from "../components/ActivateLauncherModal";
// import FaceAuthStack from "./faceAuthStack";
// import KidFlowStack from "./KidFlowStack";
// import LauncherStack from "./LauncherStack";
// import ParentFlowStack from "./ParentFlowStack";
// import { useStartup } from "./StartupContext";
// import Tabs from "./TabsNavigator";
// import TimesUpStack from "./TImesUpStack";
// import { useNavigationFlow } from "./useNavigationFlow";

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {

//     console.log('hekkk..............................');

//     const { success, error } = useDatabaseReady();
//     const { startup, refreshStartup } = useStartup();
//     const user = useSelector((state: RootState) => state.session.currentUser)
//     const userRef = useRef(user); // Keep a reference that the listener can always see
//     const dispatch = useDispatch();
//     const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(true); // Default to true to avoid flicker

//     useEffect(() => {
//         userRef.current = user; // Update ref whenever user changes
//     }, [user]);


//     useEffect(() => {
//         const sub = listenScreenState(async (state) => {
//             if (state === "OFF") {
//                 console.log('scren offf ....................');
//                 if (user?.role === 'child') {
//                     console.log("[Sync] Screen OFF: Saving for child", user?.id);
//                     // 1. SAVE FIRST
//                     await stopAndSaveChildTimer(user.id);
//                 }

//                 dispatch(requireReauth());
//                 dispatch(resetSession());
//             }

//             if (state === "ON") {
//                 console.log("[AUTH] screen on → stopping overlay");

//             }
//         });

//         return () => sub.remove();
//     }, []);


//     useEffect(() => {
//         if (success) refreshStartup();
//     }, [success]);


//     useEffect(() => {
//         // 2. THE NEW TIMER EXPIRATION LISTENER
//         const expireSub = TimelimitModule.addListener('onTimeExpired', async () => {
//             console.log('time endded we got here ');

//             if (user?.role === "child") {
//                 // A. Run the DB finalizer
//                 await handleTimeExpiration(user.id);
//                 // B. Boot them out (Clear Redux and Navigate)
//                 dispatch(setTimeExhausted(true))
//                 dispatch(requireReauth());
//                 dispatch(resetSession());


//             }
//         });

//         return () => {
//             expireSub.remove();
//         };
//     }, []);

//     useEffect(() => {
//         const checkPermission = async () => {
//             const enabled = await isServiceEnabled();
//             setIsAccessibilityEnabled(enabled);
//             console.log("Is Accessibility Service Enabled?:", enabled);
//         };

//         // Check on mount
//         checkPermission();

//         // Check again when the app comes back to foreground
//         const appStateSub = AppState.addEventListener("change", (nextAppState) => {
//             if (nextAppState === "active") {
//                 checkPermission();
//             }
//         });

//         const subscription = listenOnChange((packageName) => {
//             console.log("📱 App Event Detected:", packageName);
//             // Here is where we will eventually trigger bringAppToFront()
//         });

//         return () => {
//             subscription.remove();
//             appStateSub.remove();
//         };
//     }, []);


//     const flow = useNavigationFlow(startup);

//     const showLauncherModal = flow === "SET_APP_AS_DEFAULT_LAUNCHER";
//     console.log('show modal  state ', showLauncherModal);


//     if (error) return <View><Text>DB Error</Text></View>;
//     if (flow === "LOADING") return <View><Text>Loading...</Text></View>;
//     console.log('current route is ', flow);

//     return (
//         <>
//             <Stack.Navigator screenOptions={{ headerShown: false }} key={flow}>


//                 {flow === 'TIMES_UP' && (
//                     <Stack.Screen name="TimesUpStack" component={TimesUpStack} />
//                 )} 

//                 {flow === "ONBOARDING" && (
//                     <Stack.Screen name="ParentFlowStack" component={ParentFlowStack} />
//                 )}

//                 {flow === "LAUNCHER" && (
//                     <Stack.Screen name="LauncherStack" component={LauncherStack} />
//                 )}
//                 {flow === "UNAUTHENTICATED" && (
//                     <Stack.Screen name="FaceAuth" component={FaceAuthStack} />
//                 )}

//                 {flow === "PARENT_HOME" && (
//                     <Stack.Screen name="Tabs" component={Tabs} />
//                 )}


//                 <Stack.Screen name="KidFlow" component={KidFlowStack} />
//             </Stack.Navigator>

//             <ActivateLauncherModal
//                 visible={showLauncherModal}
//                 onClose={refreshStartup}
//             />
//         </>
//     );
// }






//v2 
import { useDatabaseReady } from "@/db/db";
import { setTimeExhausted } from "@/features/restrictionSlice";
import { requireReauth, resetSession } from "@/features/sessionSlice";
import { bringAppToFront, isServiceEnabled, listenOnChange, openAccessibilitySettings } from "@/modules/expo-app-monitor"; // Added openAccessibilitySettings
import { listenScreenState } from "@/modules/expo-screen-check";
import TimelimitModule from "@/modules/expo-TimeLimit/src/TimelimitModule";
import { handleTimeExpiration, stopAndSaveChildTimer } from "@/services/timeLimit/timeSync";
import { RootState } from "@/store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { AppState, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ActivateLauncherModal from "../components/ActivateLauncherModal";
import FaceAuthStack from "./faceAuthStack";
import KidFlowStack from "./KidFlowStack";
import LauncherStack from "./LauncherStack";
import ParentFlowStack from "./ParentFlowStack";
import { useStartup } from "./StartupContext";
import Tabs from "./TabsNavigator";
import TimesUpStack from "./TImesUpStack";
import { useNavigationFlow } from "./useNavigationFlow";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { success, error } = useDatabaseReady();
    const { startup, refreshStartup } = useStartup();
    const user = useSelector((state: RootState) => state.session.currentUser)
    const dispatch = useDispatch();

    // --- ACCESSIBILITY STATE ---
    const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(true);
    // Create a ref to track the latest user value
    const userRef = useRef(user);

    // Keep the ref in sync with the selector
    useEffect(() => {
        userRef.current = user;
    }, [user]);
    // 1. Screen State Listener
    const currentUser = userRef.current;
    useEffect(() => {
        const sub = listenScreenState(async (state) => {
            if (state === "OFF") {

                console.log('off dettected /////////////////////////////////////s');


                if (currentUser?.role === 'child') {
                    await stopAndSaveChildTimer(currentUser.id);
                }
                dispatch(requireReauth());

                console.log('....................... session restet');

                dispatch(resetSession());


                console.log(currentUser);

                console.log('....................... session restet');

            }
        });
        return () => sub.remove();
    }, [user]);

    useEffect(() => {
        if (success) refreshStartup();
    }, [success]);

    // 2. Timer Expiration Listener
    useEffect(() => {
        const expireSub = TimelimitModule.addListener('onTimeExpired', async () => {
            if (user?.role === "child") {
                await handleTimeExpiration(user.id);
                dispatch(setTimeExhausted(true));
                dispatch(requireReauth());
                dispatch(resetSession());
            }
        });
        return () => expireSub.remove();
    }, [user]);

    // 3. ACCESSIBILITY MONITORING & JUMP-IN PREP
    // 3. Accessibility & App Blocking Logic
    useEffect(() => {
        const checkPermission = async () => {
            const enabled = await isServiceEnabled();
            setIsAccessibilityEnabled(enabled);
        };

        checkPermission();

        const subscription = listenOnChange(async (packageName) => {
            // ALWAYS access .current inside the callback
            const activeUser = userRef.current;

            console.log("📱 App Event:", packageName, "User:", activeUser?.name || 'None');

            /* LOGIC: If there is NO user (unauthenticated), 
               and they try to leave the app (to System UI or Settings),
               pull them back to FaceAuth.
            */
            if (!activeUser) {
                console.log("Blocking access: No user authenticated");
                await bringAppToFront();
            }
        });

        const appStateSub = AppState.addEventListener("change", (next) => {
            if (next === "active") checkPermission();
        });

        return () => {
            subscription.remove();
            appStateSub.remove();
        };
    }, []); // Empty array is fine because we use userRef.current inside

    const flow = useNavigationFlow(startup);

    // --- MODAL VISIBILITY LOGIC ---
    const showLauncherModal = flow === "SET_APP_AS_DEFAULT_LAUNCHER";
    const showAccessibilityModal = !isAccessibilityEnabled && !showLauncherModal && flow !== "LOADING";

    if (error) return <View style={styles.center}><Text>DB Error</Text></View>;
    if (flow === "LOADING") return <View style={styles.center}><Text>Loading...</Text></View>;

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }} key={flow}>
                {flow === 'TIMES_UP' && <Stack.Screen name="TimesUpStack" component={TimesUpStack} />}
                {flow === "ONBOARDING" && <Stack.Screen name="ParentFlowStack" component={ParentFlowStack} />}
                {flow === "LAUNCHER" && <Stack.Screen name="LauncherStack" component={LauncherStack} />}
                {flow === "UNAUTHENTICATED" && <Stack.Screen name="FaceAuth" component={FaceAuthStack} />}
                {flow === "PARENT_HOME" && <Stack.Screen name="Tabs" component={Tabs} />}
                <Stack.Screen name="KidFlow" component={KidFlowStack} />
            </Stack.Navigator>

            {/* Default Launcher Modal */}
            <ActivateLauncherModal
                visible={showLauncherModal}
                onClose={refreshStartup}
            />

            {/* Milestone 1: Accessibility Simple Modal */}
            <Modal visible={showAccessibilityModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Permission Required</Text>
                        <Text style={styles.modalBody}>
                            To keep this device secure, you must enable the
                            <Text style={{ fontWeight: 'bold' }}> KidAppAccessService </Text>
                            in Accessibility settings.
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => openAccessibilitySettings()}
                        >
                            <Text style={styles.buttonText}>Open Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: 'white', padding: 25, borderRadius: 20, alignItems: 'center', width: '100%' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#d32f2f' },
    modalBody: { fontSize: 16, textAlign: 'center', marginBottom: 25, lineHeight: 22, color: '#333' },
    modalButton: { backgroundColor: '#d32f2f', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});