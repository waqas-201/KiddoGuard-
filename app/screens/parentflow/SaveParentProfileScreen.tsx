import { db } from "@/db/db";
import { parentTable } from "@/db/schema";
import { parentDraft } from "@/storage/Parent";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
            embedding: embeddings, // already JSON
            isParentProfileCompleted: isCompleted,
        }).onConflictDoUpdate({
            target: [parentTable.id],
            set: {
                name,
                embedding: embeddings,
                isParentProfileCompleted: isCompleted,
            },
        });;
    }

export default function SaveParentProfileScreen() {
    const navigation = useNavigation<any>();

    const saveMutation = useMutation({
        mutationFn: saveParentProfile,
        onSuccess: () => {
            // Prevent going back into onboarding
            navigation.replace("Tabs", { screen: "KidsTab" });
        },
        onError: (error) => {
            console.error("❌ Failed to save parent profile:", error);
        },
    });

    // Fire once on mount
    useEffect(() => {
        saveMutation.mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Card mode="elevated" style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">
                        Setting things up
                    </Text>

                    {saveMutation.isPending && (
                        <View style={styles.stateContainer}>
                            <Text variant="bodyMedium">
                                Saving your profile securely on this device.
                            </Text>
                            <ActivityIndicator animating size="large" />
                        </View>
                    )}

                    {saveMutation.isError && (
                        <View style={styles.stateContainer}>
                            <Text variant="bodyMedium">
                                Something went wrong while saving your profile.
                            </Text>
                            <Button
                                mode="contained"
                                onPress={() => saveMutation.mutate()}
                            >
                                Retry
                            </Button>
                        </View>
                    )}
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        alignSelf: "center",
    },
    stateContainer: {
        marginTop: 16,
        gap: 12,
    },
});
