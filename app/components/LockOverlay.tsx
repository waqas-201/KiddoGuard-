// LockOverlay.tsx
import React from "react";
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

interface LockOverlayProps {
    visible: boolean;
    onAuthSuccess: () => void;
}

export default function LockOverlay() {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback>
                <View style={styles.overlay}>
                    
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.85)",
        justifyContent: "center",
        alignItems: "center",
    },
});
