// @/screens/parentflow/SecurityLayersSetup.tsx
import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert
} from "react-native";
import {
    Text,
    Button,
    useTheme,
    IconButton,
    Menu,
    ActivityIndicator
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useParentFlowNavigation } from "@/app/navigation/hooks";
import { parentDraft } from "@/storage/Parent";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/db/db";
import { parentTable } from "@/db/schema";
import { useStartup } from "@/app/navigation/StartupContext";
import { sha256 } from "js-sha256"; 

const QUESTIONS = [
    "What was the name of your first pet?",
    "In what city were you born?",
    "What was the model of your first car?",
    "What was your childhood nickname?",
];

export default function SecurityLayersSetup() {
    const theme = useTheme();
    const navigation = useParentFlowNavigation();
    const { refreshStartup } = useStartup();

    // --- STEP LOGIC ---
    const [step, setStep] = useState<"pin" | "phrase">("pin");
    const [menuVisible, setMenuVisible] = useState(false);

    // --- SECURE LOCAL STATE ---
    // We do NOT use MMKV for these. They exist only in RAM until hashed.
    const [localPin, setLocalPin] = useState("");
    const [localQuestion, setLocalQuestion] = useState("");
    const [localAnswer, setLocalAnswer] = useState("");

    // --- VALIDATION ---
    const isPinValid = localPin.length === 4;
    const isPhraseValid = localQuestion.length > 0 && localAnswer.trim().length > 1;

    // --- HASHING UTILITY ---
    const hashValue = (val: string) => sha256(val.trim().toLowerCase());

    // --- FINAL DATABASE COMMIT ---
    const saveMutation = useMutation({
        mutationFn: async () => {
            const name = parentDraft.getString("parentName");
            const embeddings = parentDraft.getString("parentFaceEmbedding");

            if (!name || !embeddings || !localPin || !localQuestion || !localAnswer) {
                throw new Error("Missing essential profile data.");
            }

            console.log("🛡️ Hashing and saving to local SQLite...");

            return db.insert(parentTable).values({
                name,
                embedding: embeddings,
                parentPin: hashValue(localPin),      // Layer 2: Hashed
                recoveryQuestion: localQuestion,     // Plain text is fine
                recoveryAnswer: hashValue(localAnswer), // Layer 3: Hashed
                isParentProfileCompleted: true,
            });
        },
        onSuccess: () => {
            parentDraft.clearAll(); // Wipe temporary face/name data
            refreshStartup();       // Re-trigger AppNavigator flow logic
        },
        onError: (error) => {
            console.error("❌ Save Error:", error);
            Alert.alert("Setup Error", "Failed to save your security profile. Please try again.");
        }
    });

    const handleNext = () => {
        if (step === "pin") {
            setStep("phrase");
        } else {
            saveMutation.mutate();
        }
    };

    if (saveMutation.isPending) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Securing your account...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <IconButton
                        icon="arrow-left"
                        onPress={() => step === "phrase" ? setStep("pin") : navigation.goBack()}
                    />
                    <Text variant="titleMedium" style={styles.headerTitle}>Security Layers</Text>
                    <View style={{ width: 48 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {step === "pin" ? (
                        <View style={styles.stepContainer}>
                            <Text variant="headlineMedium" style={styles.title}>Set Parent PIN</Text>
                            <Text variant="bodyMedium" style={styles.subtitle}>
                                Create a 4-digit code. You'll need this if Face ID fails.
                            </Text>

                            <TextInput
                                style={[styles.pinInput, { color: theme.colors.primary, borderBottomColor: theme.colors.primary }]}
                                placeholder="0000"
                                placeholderTextColor={theme.colors.outline}
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry
                                value={localPin}
                                onChangeText={setLocalPin}
                                autoFocus
                            />
                        </View>
                    ) : (
                        <View style={styles.stepContainer}>
                            <Text variant="headlineMedium" style={styles.title}>Recovery Question</Text>
                            <Text variant="bodyMedium" style={styles.subtitle}>
                                The final fallback. Choose something only you know.
                            </Text>

                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                contentStyle={{ backgroundColor: theme.colors.surface }}
                                anchor={
                                    <Button
                                        mode="outlined"
                                        onPress={() => setMenuVisible(true)}
                                        style={styles.dropdown}
                                        contentStyle={styles.dropdownContent}
                                    >
                                        {localQuestion || "Select a Question"}
                                    </Button>
                                }
                            >
                                {QUESTIONS.map((q) => (
                                    <Menu.Item
                                        key={q}
                                        onPress={() => { setLocalQuestion(q); setMenuVisible(false); }}
                                        title={q}
                                    />
                                ))}
                            </Menu>

                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.colors.surface,
                                    color: theme.colors.onSurface,
                                    borderColor: theme.colors.outline
                                }]}
                                placeholder="Answer here..."
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                value={localAnswer}
                                onChangeText={setLocalAnswer}
                                autoCapitalize="none"
                            />
                        </View>
                    )}
                </ScrollView>

                {/* Footer Action */}
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        disabled={step === "pin" ? !isPinValid : !isPhraseValid}
                        onPress={handleNext}
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        labelStyle={styles.buttonLabel}
                    >
                        {step === "pin" ? "Continue" : "Secure My Account"}
                    </Button>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 20, opacity: 0.7 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 8 },
    headerTitle: { fontWeight: "600" },
    scrollContent: { padding: 24, flexGrow: 1, justifyContent: "center" },
    stepContainer: { alignItems: "center", width: "100%" },
    title: { textAlign: "center", marginBottom: 8, fontWeight: "bold" },
    subtitle: { textAlign: "center", marginBottom: 40, opacity: 0.6, lineHeight: 22 },
    pinInput: {
        fontSize: 42,
        textAlign: "center",
        width: "60%",
        borderBottomWidth: 2,
        paddingBottom: 8,
        letterSpacing: 10
    },
    dropdown: { width: "100%", marginTop: 10, borderRadius: 12 },
    dropdownContent: { height: 56, justifyContent: "flex-start" },
    input: {
        width: "100%",
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginTop: 20,
        fontSize: 16,
        borderWidth: 1
    },
    footer: { padding: 24 },
    button: { height: 54, justifyContent: "center", borderRadius: 14 },
    buttonLabel: { fontSize: 16, fontWeight: "bold" }
});