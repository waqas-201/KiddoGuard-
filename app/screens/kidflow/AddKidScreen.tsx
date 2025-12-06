import { useKidFlowNavigation, useRootNavigation } from "@/app/navigation/hooks";
import { kidDraft } from "@/storage/kid";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Button, IconButton, Menu, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddKidScreen() {
    const theme = useTheme();
    const navigation = useKidFlowNavigation()
    const rootNavigator = useRootNavigation()

    const [name, setName] = useMMKVString("kid_name", kidDraft);
    const [age, setAge] = useMMKVString("kid_age", kidDraft);

    // Menu visibility
    const [menuVisible, setMenuVisible] = useState(false);

    const ageOptions = Array.from({ length: 12 }, (_, i) => (i + 4).toString());

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
                    onPress={() => rootNavigator.navigate('Tabs', { screen: "KidsTab" })}
                />
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.onSurface,
                        fontWeight: "600",
                        fontSize: 18,
                    }}
                >
                    Add a Kid
                </Text>
                <View style={{ width: 48 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.titleSection}>
                    <Text
                        variant="headlineLarge"
                        style={{ color: theme.colors.onBackground, textAlign: "center" }}
                    >
                        What's your child's name?
                    </Text>
                    <Text
                        variant="bodyMedium"
                        style={{
                            color: theme.colors.onSurface,
                            textAlign: "center",
                            marginTop: 4,
                        }}
                    >
                        Enter your child's name and age so we can set up their profile.
                    </Text>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                    style={{ width: "100%", maxWidth: 300 }}
                >
                    {/* Kid Name */}
                    <View style={{ marginBottom: 20 }}>
                        <Text
                            variant="labelLarge"
                            style={{ color: theme.colors.onSurface, marginBottom: 4 }}
                        >
                            Kid's Name
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
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Age Selector */}
                    <View>
                        <Text
                            variant="labelLarge"
                            style={{ color: theme.colors.onSurface, marginBottom: 8 }}
                        >
                            Age
                        </Text>
                        <Menu
                            key={String(menuVisible)} // ✅ ensures menu can reopen multiple times
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <Button
                                    mode="outlined"
                                    style={[
                                        styles.input,
                                        {
                                            justifyContent: "space-between",
                                            borderColor: theme.colors.onSurface + "33",
                                        },
                                    ]}
                                    contentStyle={{ flexDirection: "row-reverse" }}
                                    onPress={() => setMenuVisible(true)}
                                >
                                    {age ? `${age} years old` : "Select age"}
                                </Button>
                            }
                        >
                            {ageOptions.map((a) => (
                                <Menu.Item
                                    key={a}
                                    onPress={() => {
                                        setAge(a);
                                        setMenuVisible(false);
                                    }}
                                    title={`${a} years old`}
                                />
                            ))}
                        </Menu>
                    </View>
                </KeyboardAvoidingView>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor:
                                name && age ? theme.colors.primary : theme.colors.surfaceDisabled,
                        },
                    ]}
                    onPress={() => navigation.navigate('SetTimeLimit')}
                    activeOpacity={0.8}
                    disabled={!name || !age} // ✅ disabled until both fields are filled
                >
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color:
                                    name && age ? theme.colors.onPrimary : theme.colors.onSurface + "66",
                            },
                        ]}
                    >
                        Continue
                    </Text>
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
        marginBottom: 12,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 16,
    },
    titleSection: {
        marginBottom: 24,
        alignItems: "center",
        paddingHorizontal: 16,
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
        width: "100%",
        maxWidth: 300,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        padding: 14,
    },
    buttonText: { fontSize: 16, fontWeight: "700" },
});
