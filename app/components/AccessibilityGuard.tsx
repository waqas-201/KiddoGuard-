// @/components/AccessibilityGuard.tsx
import { isServiceEnabled, openAccessibilitySettings } from "@/modules/expo-app-monitor";
import React, { useEffect, useState } from 'react';
import { AppState, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const AccessibilityGuard = ({ isSetupComplete }: { isSetupComplete: boolean |undefined }) => {
    const [isEnabled, setIsEnabled] = useState(true);

    const check = async () => setIsEnabled(await isServiceEnabled());

    useEffect(() => {
        if (!isSetupComplete) return;
        check();
        const sub = AppState.addEventListener("change", (s) => s === "active" && check());
        return () => sub.remove();
    }, [isSetupComplete]);

    if (!isSetupComplete  || isEnabled) return null;

    return (
        <Modal visible transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>System Access Required</Text>
                    <Text style={styles.body}>Please enable <Text style={{ fontWeight: 'bold' }}>KidAppAccessService</Text> to continue.</Text>
                    <TouchableOpacity style={styles.button} onPress={openAccessibilitySettings}>
                        <Text style={styles.btnText}>Enable in Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 25 },
    content: { backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#d32f2f', marginBottom: 10 },
    body: { textAlign: 'center', marginBottom: 20, lineHeight: 22 },
    button: { backgroundColor: '#d32f2f', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
    btnText: { color: 'white', fontWeight: 'bold' }
});