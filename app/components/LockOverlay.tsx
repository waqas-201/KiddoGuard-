// LockOverlayScreen.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import FaceAuth from "../screens/faceAuth/faceAuth";

export default function LockOverlayScreen() {
    return (
        <View style={styles.container}>
            {/* Dark overlay background */}
            <View style={styles.overlay} />

            {/* Embedded FaceAuth */}
            <FaceAuth />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.85)",
    },
});
