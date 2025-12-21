import { useRootNavigation } from "@/app/navigation/hooks";
import { useStartup } from "@/app/navigation/StartupContext";
import { db } from "@/db/db";
import { parentTable } from "@/db/schema";
import { parentDraft } from "@/storage/Parent";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

/**
 * Save parent profile from MMKV draft into local database.
 * One-time onboarding step.
 * Intentionally simple – no idempotence, no guards.
 */
async function saveParentProfile() {


    const name = parentDraft.getString("parentName");
    const embeddings = parentDraft.getString("parentFaceEmbedding");
    const isCompleted = parentDraft.getBoolean("isParentProfileCompleted");

    if (!name) throw new Error("parentName missing in draft");
    if (!embeddings) throw new Error("parentFaceEmbedding missing in draft");
    if (!isCompleted) throw new Error("Parent profile not marked complete");

    console.log("💾 Saving parent profile to DB...");

    return db.insert(parentTable).values({
        name,
        embedding: embeddings,
        isParentProfileCompleted: isCompleted,
    }).onConflictDoUpdate({
        target: [parentTable.id],
        set: {
            name,
            embedding: embeddings,
            isParentProfileCompleted: isCompleted,
        },
    });
}

export default function SaveParentProfileScreen() {
    const navigation = useRootNavigation();
    const { refreshStartup } = useStartup()

    const saveMutation = useMutation({
        mutationFn: saveParentProfile,
        onSuccess: () => {
            parentDraft.clearAll()
            refreshStartup()
            // navigation.replace("Tabs", { screen: "KidsTab" });

        },
        onError: (error) => {
            console.error("❌ Failed to save parent profile:", error);
        },
    });

    useEffect(() => {
        saveMutation.mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // <SafeAreaView style={styles.container}>
        //     <View style={styles.content}>
        //         <Card mode="elevated" style={styles.card} elevation={2}>
        //             <Card.Content style={styles.cardContent}>
        //                 {saveMutation.isPending && (
        //                     <>
        //                         <View style={styles.iconContainer}>
        //                             <ActivityIndicator size={48} />
        //                         </View>

        //                         <Text variant="headlineSmall" style={styles.title}>
        //                             Setting up your profile
        //                         </Text>

        //                         <Text variant="bodyMedium" style={styles.description}>
        //                             We're securely saving your information on this device.
        //                             This will only take a moment.
        //                         </Text>

        //                         <ProgressBar indeterminate style={styles.progressBar} />

        //                         <View style={styles.statusList}>
        //                             <StatusItem text="Encrypting profile data" />
        //                             <StatusItem text="Storing facial recognition data" />
        //                             <StatusItem text="Finalizing setup" />
        //                         </View>
        //                     </>
        //                 )}

        //                 {saveMutation.isError && (
        //                     <>
        //                         <View style={styles.iconContainer}>
        //                             <Text style={styles.errorIcon}>⚠️</Text>
        //                         </View>

        //                         <Text variant="headlineSmall" style={styles.title}>
        //                             Setup incomplete
        //                         </Text>

        //                         <Text variant="bodyMedium" style={styles.description}>
        //                             We encountered an issue while saving your profile.
        //                             Please try again to continue.
        //                         </Text>

        //                         <View style={styles.errorDetails}>
        //                             <Text variant="bodySmall" style={styles.errorText}>
        //                                 If this problem persists, please check your device storage
        //                                 and ensure the app has necessary permissions.
        //                             </Text>
        //                         </View>

        //                         <Button
        //                             mode="contained"
        //                             onPress={() => saveMutation.mutate()}
        //                             style={styles.retryButton}
        //                             contentStyle={styles.buttonContent}
        //                         >
        //                             Try Again
        //                         </Button>
        //                     </>
        //                 )}

        //                 {saveMutation.isSuccess && (
        //                     <>
        //                         <View style={styles.iconContainer}>
        //                             <Text style={styles.successIcon}>✓</Text>
        //                         </View>

        //                         <Text variant="headlineSmall" style={styles.title}>
        //                             Profile created successfully
        //                         </Text>

        //                         <Text variant="bodyMedium" style={styles.description}>
        //                             Your information has been securely saved.
        //                             Redirecting you to the app...
        //                         </Text>
        //                     </>
        //                 )}
        //             </Card.Content>
        //         </Card>

        //         <Text variant="bodySmall" style={styles.footer}>
        //             Your data is encrypted and stored locally on your device
        //         </Text>
        //     </View>
        // </SafeAreaView>

        <></>
    );
}

function StatusItem({ text }: { text: string }) {
    return (
        <View style={styles.statusItem}>
            <View style={styles.statusDot} />
            <Text variant="bodySmall" style={styles.statusText}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    card: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        backgroundColor: "#ffffff",
    },
    cardContent: {
        paddingVertical: 32,
        paddingHorizontal: 24,
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        textAlign: "center",
        marginBottom: 12,
        fontWeight: "600",
    },
    description: {
        textAlign: "center",
        opacity: 0.7,
        lineHeight: 22,
        marginBottom: 24,
    },
    progressBar: {
        marginBottom: 24,
        height: 3,
    },
    statusList: {
        gap: 12,
        paddingHorizontal: 8,
    },
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#666",
        opacity: 0.4,
    },
    statusText: {
        opacity: 0.6,
        fontSize: 13,
    },
    errorIcon: {
        fontSize: 48,
    },
    successIcon: {
        fontSize: 56,
        color: "#4CAF50",
        fontWeight: "bold",
    },
    errorDetails: {
        backgroundColor: "#fef6f6",
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: "#f44336",
    },
    errorText: {
        opacity: 0.7,
        lineHeight: 20,
    },
    retryButton: {
        marginTop: 4,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    footer: {
        textAlign: "center",
        opacity: 0.5,
        marginTop: 24,
    },
});