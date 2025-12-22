import { isDefaultLauncher, requestSetDefaultLauncher } from "@/modules/expo-launcher";
import { useEffect } from "react";
import { Image, Modal, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function ActivateLauncherModal({ visible, onClose }: Props) {
    const theme = useTheme();

    useEffect(() => {
        if (!visible) return;
        const check = async () => {
            if (await isDefaultLauncher()) onClose();
        };
        check();
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.backdrop}>
                <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
                    <Image
                        source={{ uri: "https://your-image.png" }}
                        style={styles.icon}
                    />

                    <Text variant="headlineSmall" style={{ marginBottom: 12 }}>
                        Activate KiddoGuard?
                    </Text>

                    <Text
                        variant="bodyMedium"
                        style={{ textAlign: "center", marginBottom: 24 }}
                    >
                        Enable the launcher now for safe kid mode.
                    </Text>

                    <Button
                        mode="contained"
                        onPress={async () => {
                            await requestSetDefaultLauncher();
                            onClose();
                        }}
                    >
                        Activate
                    </Button>

                    {/* <Button
                        mode="text"
                        onPress={onClose}
                        style={{ marginTop: 8 }}
                    >
                        Skip for now
                    </Button> */}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    modal: {
        width: "85%",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
    },
    icon: {
        width: 90,
        height: 90,
        marginBottom: 16,
    },
});
