import { useParentFlowNavigation } from "@/app/navigation/hooks";
import { parentDraft } from "@/storage/Parent";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NameGenderScreen() {
    const theme = useTheme();
    const navigation = useParentFlowNavigation();
    const [name, setName] = useMMKVString("parentName", parentDraft);

    // Consider trimming and validating the name
    const trimmed = typeof name === "string" ? name.trim() : "";
    const isNameValid = trimmed.length > 0;



    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
                <View style={styles.header}>
                    <IconButton icon="arrow-left" iconColor={theme.colors.onSurface} size={24} onPress={() => navigation.goBack()} />
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: "600", fontSize: 18 }}>
                        Your Info
                    </Text>
                    <View style={{ width: 48 }} />
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    <Text variant="headlineLarge" style={{ color: theme.colors.onBackground, textAlign: "center" }}>
                        What's your name?
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, textAlign: "center", marginTop: 4 }}>
                        Please enter your full name.
                    </Text>

                    {/* Name Input */}
                    <View style={{ width: "100%", maxWidth: 300, marginTop: 24 }}>
                        <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
                            Name
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: theme.colors.onSurface + "33",
                                    backgroundColor: theme.colors.surface,
                                    color: theme.colors.onBackground,
                                },
                            ]}
                            placeholder="e.g. Ali Ahmed"
                            placeholderTextColor={theme.colors.onSurface + "99"}
                            value={name ?? ""}
                            onChangeText={setName}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                if (isNameValid) navigation.navigate("SecureAccountSetup");
                            }}
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!isNameValid}
                        onPress={() => {
                            // double-guard: prevent accidental navigation if invalid
                            if (!isNameValid) return;
                            navigation.navigate("SecureAccountSetup");
                        }}
                        style={[
                            styles.button,
                            {
                                backgroundColor: isNameValid ? theme.colors.primary : theme.colors.surfaceDisabled,
                            },
                        ]}
                    >
                        <Text style={[styles.buttonText, { color: isNameValid ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled }]}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 24 },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingHorizontal: 24,
    },
    input: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    footer: { alignItems: "center", marginBottom: 16 },
    button: {
        width: "90%",
        maxWidth: 300,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
    },
    buttonText: { fontSize: 16, fontWeight: "700" },
});
