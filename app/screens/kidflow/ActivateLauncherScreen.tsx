import { useKidFlowNavigation, useRootNavigation } from "@/app/navigation/hooks";
import { isDefaultLauncher, requestSetDefaultLauncher } from "@/modules/expo-launcher";
import { kidDraft } from "@/storage/kid";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivateLauncherScreen() {
    const theme = useTheme();
    const navigation = useKidFlowNavigation()
    const rootNavigation = useRootNavigation()
    useEffect(() => {
        const checkLauncherStatus = async () => {
            const isLauncher = await isDefaultLauncher();
            if (isLauncher) {
                navigation.navigate('Congrats')
            }
        };
        checkLauncherStatus();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}

            {/* Header */}
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    iconColor={theme.colors.onSurface}
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', fontSize: 18, marginLeft: 28 }}>
                    Activate KiddoGuard                                  </Text>
                <View style={{ width: 48 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Image
                    source={{
                        uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8vU_YnfFjFW8ayU-c0g66gn4xIMjr4V4UCaY13uRgaP0_J5rmJ0ZGdhbJpt64RfD_Dek7gMX6LIdcbZYTOEkChj5vcYMrYRLloLZh96Plhid9_3TPLF4I-6rnoL9T_h8G8E5XZBVE1kmeSi975MIRIxifbtO9PuRhL6Jt-TgbiC1Jm2MyJpr61I1q6m4mCSkxOPiojodcOsI9Tyfgjsc6XkRuoG1p5KDMFJx5-PL8NRoF5x-7CvurVtAjRRIlopBiGiJNvXj-14s",
                    }}
                    style={styles.illustration}
                    resizeMode="contain"
                />

                <Text
                    variant="headlineMedium"
                    style={[styles.title, { color: theme.colors.onSurface }]}
                >
                    Activate KiddoGuard?
                </Text>

                <Text
                    variant="bodyMedium"
                    style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
                >
                    Enable the Kiddo Guard launcher now to create a safe and controlled
                    digital space for your child.
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={
                        () => {
                            
                            requestSetDefaultLauncher()
                            kidDraft.set("isKidProfileCompleted" , true)
                        }
                    
                    
                    }
                    style={[
                        styles.primaryButton,
                        { backgroundColor: theme.colors.primary },
                    ]}
                    labelStyle={{ fontWeight: "bold", color: theme.colors.onPrimary }}
                    contentStyle={{ height: 56 }}
                >
                    Activate Now
                </Button>

                <Button
                    mode="contained-tonal"
                    onPress={() => rootNavigation.navigate("Tabs" , {screen:"KidsTab"})}
                    style={styles.secondaryButton}
                    labelStyle={{ fontWeight: "bold" }}
                    contentStyle={{ height: 56 }}
                >
                    Skip for Later
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
        marginRight: 36,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingHorizontal: 24,
    },
    illustration: {
        width: 192,
        height: 192,
        marginBottom: 32,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        textAlign: "center",
        maxWidth: 300,
    },
    footer: {
        padding: 24,
        gap: 16,
    },
    primaryButton: {
        borderRadius: 9999,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    secondaryButton: {
        borderRadius: 9999,
    },
});
