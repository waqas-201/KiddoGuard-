// OnboardingScreen.tsx
import { useParentFlowNavigation } from "@/app/navigation/hooks";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
    const theme = useTheme();
    const navigation = useParentFlowNavigation()



    // Add this to your JSX next to the start button:
    // <Button title="Stop & Get Time" onPress={handleStopTimer} />
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Image
                    source={{
                        uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAolshO4NKJ3GfFUQPotdSf_terobXo6KBMhhQPbIs-IJSnNjs44-2wD9eH9kFINVI8Q2DsmYeJTnHx29iWCKCaGXs90HPad2dHY_yitndrkjwP89CcPe6KnCzh8KbXE84rmlKz7juvsvkSkZ1RE9q6Slh9XJsauxMTfiO2E61YpNG-c_YJYX-cU4O3ilqB3UhqljfdyIFjWzsYr6ntXbRmEeVyPUZLe6HmOH7O_vPw9X8--z_F3neJI1T6eDGjGLYpNrkazSBHynA",
                    }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text variant="headlineLarge" style={{ color: theme.colors.onBackground, textAlign: "center" }}>
                        Safe & Sound Screen Time
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, textAlign: "center", marginTop: 8 }}>
                        Kiddo Guard helps you create a secure digital space for your child.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() =>
                        navigation.navigate("ParentProfile")


                    } // ✅ Correct case
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    labelStyle={{ fontSize: 16, fontWeight: "700", color: theme.colors.onPrimary }}
                >
                    Get Started
                </Button>


            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    image: {
        width: "100%",
        maxWidth: 300,
        height: 250,
        marginBottom: 24,
    },
    textContainer: {
        alignItems: "center",
    },
    footer: {
        padding: 24,
        gap: 12,
    },
    button: {
        height: 46,
        borderRadius: 114,
        justifyContent: "center",
    },
});
