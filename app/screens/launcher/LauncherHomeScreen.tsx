import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Image, Linking, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { isServiceEnabled, listenOnChange } from "@/modules/expo-app-monitor";
import { getAppIcon, getInstalledApps } from "@/modules/expo-installed-apps";
import { openApp } from "@/modules/expo-launcher";
import { getKidSafePackages } from "@/storage/kid";

interface AppItem { packageName: string; appName: string; icon: string; }

export default function KidSafeLauncherScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [serviceEnabled, setServiceEnabled] = useState(false);
    const [appLogs, setAppLogs] = useState<string[]>([]);

    // Start monitoring foreground apps
    useEffect(() => {
        const sub = listenOnChange(pkg => {
            console.log("Foreground app opened:", pkg);
            setAppLogs(prev => [pkg, ...prev]);
        });
        return () => sub.remove();
    }, []);

    // Check Accessibility Service
    useEffect(() => {
        const interval = setInterval(async () => {
            const enabled = isServiceEnabled();
            setServiceEnabled(enabled ?? false);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const openAccessibilitySettings = () => {
        if (Platform.OS === "android") {
            Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS");
        }
    };

    // Load installed kid-safe apps
    const installedAppsQuery = useQuery({
        queryKey: ["kid-launcher-apps"],
        queryFn: async (): Promise<AppItem[]> => {
            const allowedPackages = getKidSafePackages();
            if (!allowedPackages?.length) return [];
            const rawApps: AppItem[] = JSON.parse(await getInstalledApps());
            const filtered = rawApps.filter(a => allowedPackages.includes(a.packageName));

            return Promise.all(
                filtered.map(async app => ({
                    ...app,
                    icon: await getAppIcon(app.packageName)
                        .then(b64 => b64 ? `data:image/png;base64,${b64}` : "")
                        .catch(() => ""),
                }))
            );
        },
        staleTime: Infinity,
    });

    const AppTile = ({ item }: { item: AppItem }) => (
        <TouchableOpacity onPress={() => openApp(item.packageName)} style={styles.tile}>
            {item.icon ? <Image source={{ uri: item.icon }} style={styles.icon} /> :
                <View style={[styles.icon, { backgroundColor: theme.colors.surfaceVariant }]} />}
            <Text numberOfLines={1} style={styles.label}>{item.appName}</Text>
        </TouchableOpacity>
    );

    const apps = installedAppsQuery.data || [];


    if (installedAppsQuery.isLoading) return (
        <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Loading Apps...</Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top + 20, backgroundColor: theme.colors.background }]}>
            <Text style={styles.header}>Kid Home</Text>

            <FlashList
                data={apps}
                numColumns={4}
                keyExtractor={i => i.packageName}
                renderItem={({ item }) => <AppTile item={item} />}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 20 }}
            />



            <Modal visible={!serviceEnabled} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Enable Accessibility Service</Text>
                        <Text style={styles.modalDesc}>To make the launcher work properly and ensure only safe apps are used, please enable the Accessibility Service.</Text>
                        <TouchableOpacity style={styles.button} onPress={openAccessibilitySettings}>
                            <Text style={styles.buttonText}>Open Accessibility Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { textAlign: "center", fontSize: 22, fontWeight: "700", marginBottom: 20 },
    tile: { flex: 1, alignItems: "center", marginVertical: 16 },
    icon: { width: 60, height: 60, borderRadius: 16, marginBottom: 6 },
    label: { fontSize: 12, textAlign: "center", width: 70 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
    modalContent: { width: "85%", backgroundColor: "white", borderRadius: 16, padding: 24, alignItems: "center" },
    modalHeader: { fontSize: 20, fontWeight: "700", marginBottom: 12, textAlign: "center" },
    modalDesc: { fontSize: 16, marginBottom: 20, textAlign: "center", lineHeight: 22 },
    button: { backgroundColor: "#007AFF", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 },
    buttonText: { color: "white", fontWeight: "600", textAlign: "center" },
});
