// src/screens/LauncherScreen.tsx
import { openApp } from '@/modules/expo-launcher';
import * as IntentLauncher from 'expo-intent-launcher';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import { useLauncherData } from './hooks/useLauncherData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TILE_SIZE = SCREEN_WIDTH / 4;

export default function LauncherScreen() {
    const { apps, ready, serviceOk } = useLauncherData();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Fade in grid
    useEffect(() => {
        if (ready) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }).start();
        }
    }, [ready]);

    const openAccessibilitySettings = () => {
        if (Platform.OS === 'android') {
            IntentLauncher.startActivityAsync(
                IntentLauncher.ActivityAction.ACCESSIBILITY_SETTINGS
            );
        }
    };

    if (!ready) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={{ marginTop: 10 }}>Loading apps…</Text>
            </View>
        );
    }

    if (!serviceOk) {
        return (
            <View style={styles.centered}>
                <Text style={styles.warning}>⚠️ Monitoring Service Not Running</Text>
                <Text style={styles.sub}>Please enable the service from parent device.</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={openAccessibilitySettings}
                >
                    <Text style={styles.buttonText}>Open Accessibility Settings</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (apps.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.empty}>No safe apps allowed by parents.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <FlatList
                    data={apps}
                    keyExtractor={(item) => item.packageName}
                    numColumns={3}
                    contentContainerStyle={styles.grid}
                    renderItem={({ item, index }) => (
                        <AnimatedTile
                            item={item}
                            index={index}
                            onPress={() => openApp(item.packageName)}
                        />
                    )}
                />
            </Animated.View>
        </SafeAreaView>
    );
}

// -------------------- Animated Tile --------------------
function AnimatedTile({
    item,
    index,
    onPress,
}: {
        item: { packageName: string; label?: string; icon: string };
    index: number;
    onPress: () => void;
}) {
    const scale = useRef(new Animated.Value(1)).current;
    const tileFade = useRef(new Animated.Value(0)).current;
    const tileTranslate = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(tileFade, {
                toValue: 1,
                duration: 300,
                delay: index * 60,
                useNativeDriver: true,
            }),
            Animated.timing(tileTranslate, {
                toValue: 0,
                duration: 300,
                delay: index * 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const pressIn = () => {
        Animated.spring(scale, {
            toValue: 0.93,
            speed: 30,
            bounciness: 0,
            useNativeDriver: true,
        }).start();
    };

    const pressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            speed: 20,
            bounciness: 4,
            useNativeDriver: true,
        }).start();
    };

    const launchApp = () => {
        Animated.sequence([
            Animated.spring(scale, {
                toValue: 0.85,
                speed: 30,
                bounciness: 0,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                speed: 20,
                bounciness: 3,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onPress();
        });
    };

    // Make sure icon and label are valid
    const iconUri =
        item.icon.startsWith('data:image') || item.icon.startsWith('http')
            ? item.icon
            : `data:image/png;base64,${item.icon}`;

    const label = item.label || 'Unknown App';

    return (
        <TouchableWithoutFeedback
            onPressIn={pressIn}
            onPressOut={pressOut}
            onPress={launchApp}
        >
            <Animated.View
                style={[
                    styles.tile,
                    {
                        opacity: tileFade,
                        transform: [{ scale }, { translateY: tileTranslate }],
                    },
                ]}
            >
                <Image source={{ uri: iconUri }} style={styles.icon} />
                <Text numberOfLines={1} style={styles.label}>
                    {label}
                </Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    grid: {
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    tile: {
        width: TILE_SIZE,
        height: TILE_SIZE + 25,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
    },
    icon: {
        width: TILE_SIZE * 0.65,
        height: TILE_SIZE * 0.65,
        borderRadius: 12,
    },
    label: {
        marginTop: 6,
        fontSize: 12,
        textAlign: 'center',
        width: '100%',
    },
    warning: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
    },
    sub: {
        marginTop: 5,
        color: '#555',
        textAlign: 'center',
    },
    empty: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
