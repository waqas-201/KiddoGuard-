// app/kidFlow/ProfileCreatedScreen.tsx
import { useKidFlowNavigation } from "@/app/navigation/hooks";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileCreatedScreen() {
    const theme = useTheme();
    const navigation = useKidFlowNavigation()

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

            {/* Header */}
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    iconColor={theme.colors.onSurface}
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', fontSize: 18 }}>
                    Add New Kid Profile
                </Text>
                <View style={{ width: 48 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View
                    style={[
                        styles.outerCircle,
                        { backgroundColor: theme.colors.primary + "33" },
                    ]}
                >
                    <View
                        style={[
                            styles.innerCircle,
                            { backgroundColor: theme.colors.primary },
                        ]}
                    >
                        <Text variant="displayMedium" style={styles.checkIcon}>
                            ✓
                        </Text>
                    </View>
                </View>

                <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
                    Profile Created!
                </Text>
                <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurface }]}>
                    You've successfully set up face authentication, time limits, and app whitelisting for your child's profile.
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                 onPress={() => navigation.navigate("ActivateLauncherScreen")}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                >
                    Next
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: 24,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        textAlign: "center",
    },
    outerCircle: {
        height: 128,
        width: 128,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
    },
    innerCircle: {
        height: 96,
        width: 96,
        borderRadius: 48,
        alignItems: "center",
        justifyContent: "center",
    },
    checkIcon: {
        color: "white",
        fontSize: 48,
        fontWeight: "bold",
    },
    title: {
        marginTop: 32,
        fontWeight: "bold",
        textAlign: "center",
    },
    description: {
        marginTop: 8,
        maxWidth: 300,
        textAlign: "center",
    },
    footer: {
        width: "100%",
        alignItems: "center",
    },
    button: {
        width: "100%",
        maxWidth: 300,
        borderRadius: 121,
        elevation: 2,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    buttonLabel: {
        fontWeight: "bold",
    },
});
