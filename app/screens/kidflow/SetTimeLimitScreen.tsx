import { useKidFlowNavigation } from "@/app/navigation/hooks";
import { kidDraft } from "@/storage/kid";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetTimeLimitScreen() {
    const theme = useTheme();
    const navigation = useKidFlowNavigation();

    // Update your useState initialization:
    const [time, setTime] = useState<number>(() => {
        const storedSeconds = kidDraft.getNumber("time");
        // Convert back to hours: 900 / 3600 = 0.25
        return storedSeconds ? storedSeconds / 3600 : 1;
    });
    // Save the final value on "Save" click
    const handleKidPress = () => {
        // Example: 0.25h * 3600 = 900 seconds (15 minutes)
        const timeInSeconds = Math.floor(time * 3600);

        // 2. Save to your draft/database
        kidDraft.set("time", timeInSeconds);
        navigation.navigate('KidFaceScan');
    };

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
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: "600", fontSize: 18 }}>
                    Set Time Limit
                </Text>
                <View style={{ width: 48 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text variant="headlineLarge" style={{ color: theme.colors.onBackground }}>
                    Daily Time Cap
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 4, textAlign: "center" }}>
                    Set the maximum total screen time your child is allowed each day.
                </Text>

                <View style={[styles.sliderContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text variant="displayMedium" style={{ color: theme.colors.onBackground, fontWeight: "bold" }}>
                        {Math.floor(time)}h {Math.round((time % 1) * 60)}m
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
                        per day
                    </Text>

                    <Slider
                        style={{ width: "100%", marginTop: 16 }}
                        minimumValue={0}
                        maximumValue={12}
                        step={0.01} // 15min steps
                        value={time}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.surfaceVariant || "#e0e0e0"}
                        thumbTintColor={theme.colors.primary}
                        onValueChange={setTime} // only updates local state
                    />

                    <View style={styles.sliderLabels}>
                        <Text style={{ color: theme.colors.onSurface }}>0h</Text>
                        <Text style={{ color: theme.colors.onSurface }}>12h</Text>
                    </View>

                    <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginTop: 8, textAlign: 'center' }}>
                        Recommended for kids: 1–2h/day
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleKidPress}
                    style={{ width: "100%", maxWidth: 300, borderRadius: 24 }}
                    contentStyle={{ height: 48 }}
                    labelStyle={{ color: theme.colors.onPrimary, fontWeight: "700", fontSize: 16 }}
                >
                    Save
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "space-between", padding: 24 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
    content: { flex: 1, alignItems: "center", justifyContent: "flex-start", gap: 16 },
    sliderContainer: {
        width: "100%",
        maxWidth: 300,
        borderRadius: 16,
        padding: 24,
        marginTop: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        alignItems: "center",
        position: "relative",
    },
    sliderLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 8,
    },
    footer: { width: "100%", alignItems: "center", marginBottom: 8 },
});
