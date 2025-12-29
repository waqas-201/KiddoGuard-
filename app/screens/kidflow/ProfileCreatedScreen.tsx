// app/screens/kidflow/ProfileCreatedScreen.tsx
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useKidFlowNavigation } from "@/app/navigation/hooks";
import { db } from "@/db/db";
import { childTable, parentTable } from "@/db/schema";
import { kidDraft } from "@/storage/kid";

export default function ProfileCreatedScreen() {
    const theme = useTheme();
    const navigation = useKidFlowNavigation();
    const [loading, setLoading] = useState(false);

    const handleProfileCreated = async () => {
        /* ---------------- Parent ---------------- */
        const parent = await db
            .select({ id: parentTable.id })
            .from(parentTable)
            .get();

        if (!parent) {
            throw new Error("Parent not found");
        }

        const parentId = parent.id;

        /* ---------------- Kid Draft ---------------- */
        const name = kidDraft.getString("kid_name");
        const age = kidDraft.getNumber("kid_age");
        console.log(age);

        const embedding = kidDraft.getString("kidFaceEmbedding");
        const timeLimit = kidDraft.getNumber("time");
        const isCompleted = kidDraft.getBoolean("isKidProfileCompleted") ?? false;








        try {
            const resultFromInsert = await db.insert(childTable).values({
                name: name!, // now guaranteed to be string
                age: age!, // now guaranteed to be number
                embedding: embedding!, // now guaranteed to be string
                dailyLimitSeconds: timeLimit!, // now guaranteed to be number
                isKidProfileCompleted: isCompleted!,
                parentId: parentId!,
            });


            if (resultFromInsert) {
                kidDraft.clearAll()
                navigation.navigate("ActivateLauncherScreen");
            }

        } catch (error) {

            //TODO add retry logic 
            console.log(error);

        }
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    iconColor={theme.colors.onSurface}
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface, fontWeight: "600" }}
                >
                    Add New Kid Profile
                </Text>
                <View style={{ width: 48 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View
                    style={[
                        styles.outerCircle,
                        { backgroundColor: theme.colors.primary + "33" },
                    ]}
                >
                    <View
                        style={[styles.innerCircle, { backgroundColor: theme.colors.primary }]}
                    >
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                </View>

                <Text
                    variant="headlineLarge"
                    style={[styles.title, { color: theme.colors.onBackground }]}
                >
                    Profile Created!
                </Text>

                <Text
                    variant="bodyMedium"
                    style={[styles.description, { color: theme.colors.onSurface }]}
                >
                    You've successfully set up face authentication, time limits, and app
                    whitelisting for your child's profile.
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleProfileCreated}
                    loading={loading}
                    disabled={loading}
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                >
                    Next
                </Button>
            </View>
        </SafeAreaView>
    );
}

/* ---------------- Styles ---------------- */

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
        borderRadius: 24,
    },
});
