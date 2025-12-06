import { useKidFlowNavigation } from "@/app/navigation/hooks";
import { getAppIcon, getInstalledApps } from "@/modules/expo-installed-apps";
import { saveKidSafePackages } from "@/storage/kid";
import NetInfo from "@react-native-community/netinfo";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, IconButton, ProgressBar, Switch, Text, useTheme } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

/* ---------------- TYPES ---------------- */
interface AppItem {
    packageName: string;
    appName: string;
    versionName?: string;
    icon: string;
    isKidSafe?: boolean;
}
type Step = "loading" | "classifying" | "review" | "error";

/* ---------------- CARD ---------------- */
const KidSafeCard = ({ item, allowed, onToggle }: { item: AppItem; allowed: boolean; onToggle: (pkg: string) => void }) => {
    const theme = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onToggle(item.packageName)}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
        >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                {item.icon ? (
                    <Image source={{ uri: item.icon }} style={styles.icon} />
                ) : (
                    <View style={[styles.icon, { backgroundColor: theme.colors.surfaceVariant }]} />
                )}
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text numberOfLines={1} style={styles.appName}>{item.appName}</Text>
                    {item.versionName && <Text style={styles.appVersion}>v{item.versionName}</Text>}
                </View>
            </View>
            <Switch value={allowed} onValueChange={() => onToggle(item.packageName)} />
        </TouchableOpacity>
    );
};

/* ---------------- MAIN ---------------- */
export default function SafeAppsSelection() {
    const insets = useSafeAreaInsets();
    const navigation = useKidFlowNavigation()

    /* ------ STATE ------ */
    const [flowStep, setFlowStep] = useState<Step>("loading");
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState("Loading your apps...");
    const [classifiedApps, setClassifiedApps] = useState<AppItem[]>([]);
    const [hasInternet, setHasInternet] = useState(true);
    const [forceClassification, setForceClassification] = useState(0); // counter


    /* ------ INTERNET LISTENER ------ */
    useEffect(() => NetInfo.addEventListener(state => setHasInternet(state.isConnected ?? false)), []);

    /* ------ LOAD INSTALLED APPS ------ */
    const installedAppsQuery = useQuery({
        queryKey: ["installed-apps"],
        queryFn: async (): Promise<AppItem[]> => {
            if (Platform.OS !== "android") throw new Error("Android only");

            setLoadingMessage("Scanning installed apps...");
            setLoadingProgress(0.2);

            const rawApps = JSON.parse(await getInstalledApps());
            setLoadingMessage(`Found ${rawApps.length} apps...`);
            setLoadingProgress(0.35);

            const apps: AppItem[] = await Promise.all(
                rawApps.map(async (app: any, index: number) => {
                    const iconBase64 = await getAppIcon(app.packageName).catch(() => "");
                    setLoadingProgress(0.35 + (index / rawApps.length) * 0.35);
                    return { ...app, icon: iconBase64 ? `data:image/png;base64,${iconBase64}` : "" };
                })
            );

            setLoadingProgress(0.7);
            return apps;
        }
    });

    /* ------ CLASSIFY NEW APPS ------ */
    const classifyAppsMutation = useMutation({
        mutationFn: async (apps: AppItem[]) => {
            setFlowStep("classifying");
            setLoadingMessage("Analyzing apps for child safety...");
            setLoadingProgress(0.8);

            console.log('about to send request to backend ');

            const res = await fetch("http://192.168.125.124:3000/api/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appNames: apps.map(a => ({ packageName: a.packageName, appName: a.appName })) }),
            });


            console.log('after sendign request to backend .....');


            const data = await res.json();
            setLoadingProgress(0.95);
            return data.apps;
        },
        onSuccess: (result, newApps) => {
            const safePackages = new Set(result.map((x: any) => x.packageName));
            const processedNewApps = newApps.map(a => ({ ...a, isKidSafe: safePackages.has(a.packageName) }));

            // merge newly classified apps with existing
            const mergedApps = [
                ...classifiedApps.filter(a => !processedNewApps.find(n => n.packageName === a.packageName)),
                ...processedNewApps
            ];
            setClassifiedApps(mergedApps);

            setLoadingProgress(1);
            setTimeout(() => setFlowStep("review"), 300);
        },
        onError: () => {
            setFlowStep("error");
            setLoadingMessage("Failed to classify apps.");
        }
    });

    /* ------ AUTO CLASSIFY NEW APPS ------ */
    useEffect(() => {
        if (!installedAppsQuery.data || !hasInternet) return;

        const installedPackageNames = new Set(installedAppsQuery.data.map(a => a.packageName));
        const classifiedPackageNames = new Set(classifiedApps.map(a => a.packageName));

        const newApps = installedAppsQuery.data.filter(a => !classifiedPackageNames.has(a.packageName));

        if (newApps.length > 0) classifyAppsMutation.mutate(newApps);
        else setFlowStep("review"); // no new apps
    }, [installedAppsQuery.data, hasInternet, forceClassification]);

    /* ------ HANDLERS ------ */
    const toggleAppPermission = (packageName: string) => {
        setClassifiedApps(prev =>
            prev.map(a => a.packageName === packageName ? { ...a, isKidSafe: !a.isKidSafe } : a)
        );
    };

    const saveSelections = () => {
        const allowed = classifiedApps
            .filter(a => a.isKidSafe)
            .map(a => a.packageName);

        saveKidSafePackages(allowed);
        navigation.navigate("ProfileCreatedScreen")
    };

    /* ---------------- RENDER ---------------- */
    if (flowStep === "error") return (
        <SafeAreaView style={styles.container}>
            <View style={styles.center}>
                <IconButton icon="alert-circle-outline" size={70} />
                <Text style={styles.errTitle}>Something went wrong</Text>
                <Text style={styles.errBody}>{loadingMessage}</Text>
                <Button onPress={() => setForceClassification((prev) => prev + 1)} mode="contained" style={{ marginTop: 20 }}>Retry</Button>
            </View>
        </SafeAreaView>
    );

    if (flowStep === "review") return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Kid-Safe Apps</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.headline}>Allowed Apps</Text>
                <Text style={styles.sub}>Tap to allow or block</Text>
                <FlashList
                    data={classifiedApps.filter(a => a.isKidSafe)}
                    keyExtractor={item => item.packageName}
                    renderItem={({ item }) => (
                        <KidSafeCard
                            item={item}
                            allowed={!!item.isKidSafe}
                            onToggle={toggleAppPermission}
                        />
                    )}
                />
            </View>
            <View style={{ padding: 24 }}>
                <Button onPress={saveSelections} mode="contained" style={styles.saveBtn}>Save</Button>
            </View>
        </SafeAreaView>
    );

    /* ------ LOADING SCREEN ------ */
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Checking Apps</Text>
            </View>
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadTitle}>{flowStep === "loading" ? "Loading" : "Checking"}</Text>
                <Text style={styles.loadMsg}>{loadingMessage}</Text>
                <ProgressBar progress={loadingProgress} style={{ height: 8, marginTop: 40 }} />
                <Text style={styles.loadPct}>{Math.round(loadingProgress * 100)}%</Text>
            </View>
        </SafeAreaView>
    );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24 },
    headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },
    body: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
    headline: { fontSize: 28, fontWeight: "600" },
    sub: { color: "#666", marginTop: 4, marginBottom: 16 },
    card: { flexDirection: "row", paddingVertical: 12, alignItems: "center" },
    icon: { width: 48, height: 48, borderRadius: 12 },
    appName: { fontSize: 16, fontWeight: "500" },
    appVersion: { fontSize: 12, color: "#666" },
    saveBtn: { marginTop: 16, borderRadius: 24 },
    errTitle: { marginTop: 16, fontSize: 20, fontWeight: "700" },
    errBody: { marginTop: 8, fontSize: 14, textAlign: "center", opacity: 0.6 },
    loadTitle: { marginTop: 20, fontSize: 18, fontWeight: "600" },
    loadMsg: { marginTop: 8, fontSize: 14, opacity: 0.7 },
    loadPct: { marginTop: 8, fontSize: 12, opacity: 0.5 },
});
