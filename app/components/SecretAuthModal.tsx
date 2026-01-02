// @/components/auth/SecretAuthModal.tsx
import { db } from '@/db/db';
import { parentTable } from '@/db/schema';
import { clearRequireReauth, setUser } from '@/features/sessionSlice';
import { sha256 } from 'js-sha256';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';

type AuthView = 'PIN' | 'NAME_CHECK' | 'PHRASE';

export const SecretAuthModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [view, setView] = useState<AuthView>('PIN');
    const [parentData, setParentData] = useState<any>(null);

    // Inputs
    const [inputPin, setInputPin] = useState('');
    const [inputName, setInputName] = useState('');
    const [inputAnswer, setInputAnswer] = useState('');

    const hash = (val: string) => sha256(val.trim().toLowerCase());

    useEffect(() => {
        if (visible) {
            const fetchParent = async () => {
                const results = await db.select().from(parentTable).limit(1);
                if (results.length > 0) setParentData(results[0]);
            };
            fetchParent();
        }
    }, [visible]);

    const handleSuccess = () => {
        if (!parentData) return;

        // 1. Set the User in Redux
        dispatch(setUser({
            id: parentData.id,
            role: 'parent',
            name: parentData.name
        }));

        // 2. Clear the re-auth flag so SecurityGuard lets them in
        dispatch(clearRequireReauth());

        closeAndReset();
    };

    const handleVerifyPin = () => {
        if (parentData && hash(inputPin) === parentData.parentPin) {
            handleSuccess();
        } else {
            Alert.alert("Access Denied", "Incorrect PIN.");
            setInputPin('');
        }
    };

    const handleVerifyRecovery = () => {
        if (!parentData) return;

        const nameMatches = inputName.trim().toLowerCase() === parentData.name.toLowerCase();
        const answerMatches = hash(inputAnswer) === parentData.recoveryAnswer;

        if (nameMatches && answerMatches) {
            handleSuccess();
        } else {
            Alert.alert("Verification Failed", "Information does not match our records.");
        }
    };

    const closeAndReset = () => {
        setView('PIN');
        setInputPin('');
        setInputName('');
        setInputAnswer('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={closeAndReset}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
            >
                <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>

                    {view === 'PIN' && (
                        <View style={styles.viewContainer}>
                            <Text variant="headlineSmall" style={styles.title}>Parent Access</Text>
                            <Text style={styles.subtitle}>Enter PIN to bypass Face Authentication.</Text>
                            <TextInput
                                style={[styles.input, { color: theme.colors.onSurface, borderBottomColor: theme.colors.primary }]}
                                placeholder="0000"
                                keyboardType="numeric"
                                secureTextEntry
                                maxLength={4}
                                value={inputPin}
                                onChangeText={setInputPin}
                                autoFocus
                            />
                            <Button mode="contained" onPress={handleVerifyPin} style={styles.mainBtn}>
                                Verify PIN
                            </Button>
                            <Button onPress={() => setView('NAME_CHECK')} textColor={theme.colors.secondary}>
                                Forgot PIN?
                            </Button>
                        </View>
                    )}

                    {view === 'NAME_CHECK' && (
                        <View style={styles.viewContainer}>
                            <Text variant="headlineSmall" style={styles.title}>Recovery Mode</Text>
                            <Text style={styles.subtitle}>Confirm your name as saved in the profile.</Text>
                            <TextInput
                                style={[styles.input, { color: theme.colors.onSurface, borderBottomColor: theme.colors.primary }]}
                                placeholder="Parent Full Name"
                                value={inputName}
                                onChangeText={setInputName}
                                autoFocus
                            />
                            <Button mode="contained" onPress={() => setView('PHRASE')} style={styles.mainBtn}>
                                Next
                            </Button>
                            <Button onPress={() => setView('PIN')}>Back</Button>
                        </View>
                    )}

                    {view === 'PHRASE' && (
                        <View style={styles.viewContainer}>
                            <Text variant="headlineSmall" style={styles.title}>Final Fallback</Text>
                            <Text style={[styles.questionLabel, { color: theme.colors.primary }]}>
                                {parentData?.recoveryQuestion}
                            </Text>
                            <TextInput
                                style={[styles.input, { color: theme.colors.onSurface, borderBottomColor: theme.colors.primary }]}
                                placeholder="Your Answer"
                                value={inputAnswer}
                                onChangeText={setInputAnswer}
                                autoFocus
                                autoCapitalize="none"
                            />
                            <Button mode="contained" onPress={handleVerifyRecovery} style={styles.mainBtn}>
                                Verify & Log In
                            </Button>
                            <Button onPress={() => setView('NAME_CHECK')}>Back</Button>
                        </View>
                    )}

                    <TouchableOpacity onPress={closeAndReset} style={styles.cancelBtn}>
                        <Text style={{ color: theme.colors.error, fontWeight: 'bold' }}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 25 },
    content: { borderRadius: 24, padding: 30, elevation: 10 },
    viewContainer: { alignItems: 'center', width: '100%' },
    title: { fontWeight: 'bold', marginBottom: 8 },
    subtitle: { textAlign: 'center', marginBottom: 25, opacity: 0.6, fontSize: 14 },
    questionLabel: { textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: 15 },
    input: { width: '100%', borderBottomWidth: 2, fontSize: 24, textAlign: 'center', marginBottom: 30, paddingVertical: 10 },
    mainBtn: { width: '100%', height: 50, justifyContent: 'center', borderRadius: 12, marginBottom: 10 },
    cancelBtn: { marginTop: 15, alignSelf: 'center', padding: 10 }
});