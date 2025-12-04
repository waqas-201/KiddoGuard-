// ParentProfileScreen.tsx
import { useParentFlowNavigation } from "@/app/navigation/hooks";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParentProfileScreen() {
    const theme = useTheme();
   const navigation = useParentFlowNavigation()

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
                    Parent Profile
                </Text>
                <View style={{ width: 48 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Image
                    source={{
                        uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBemx7GrNNCujSa3m7sxoEBlhUX4oQRJ5DiK9dMCWEUv3_oPr69dzP1Op0NOw1rNEOfmVGZ7WTqAeLJxjTUyBPt7PdcA5aSfnI-jYLgtZJBvp36lf1pbhVJ2JRIUl0pxVtM4PNczCELEbQCYg0KwH4fICMPajc-i8nAqB_bnyTFWCQ2ulCWbcoMU4D9kIevkw_Q3Hkd68bB-x8b-zbYIoozxAL4fhSEmwdxyHNRUUklmEPuBhIGZUU3odGIRIYc909kieLtDg_NWi4",
                    }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
                    Create your parent profile
                </Text>
                <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurface }]}>
                    Your profile is stored securely on your device only — fully encrypted and under your control.
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={() => { navigation.navigate("NameAndGenderScreen")} }
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "space-between", padding: 24 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    content: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
    image: { width: 220, height: 220, marginBottom: 16, borderRadius: 16 },
    title: { textAlign: "center" },
    subtitle: { textAlign: "center", marginTop: 4 },
    footer: { width: "100%", alignItems: "center" },
    button: {
        width: "100%",
        maxWidth: 300,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
    },
    buttonText: { fontSize: 16, fontWeight: "700" },
});
