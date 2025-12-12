// src/screens/LauncherScreen.tsx
import { openApp } from '@/modules/expo-launcher';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useLauncherData } from './hooks/useLauncherData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TILE_SIZE = SCREEN_WIDTH / 4;

export default function LauncherScreen() {
    const { apps, ready, serviceOk } = useLauncherData();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    // --- Fade in grid ---
    useEffect(() => {
        if (ready) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }).start();
        }
    }, [ready]);

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
    item: any;
    index: number;
    onPress: () => void;
}) {
    const scale = useRef(new Animated.Value(1)).current;
    const tileFade = useRef(new Animated.Value(0)).current;
    const tileTranslate = useRef(new Animated.Value(20)).current;

    // Stagger effect per tile
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
        // Small pop animation before launching app
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
                        transform: [
                            { scale },
                            { translateY: tileTranslate },
                        ],
                    },
                ]}
            >
                <Image
                    source={{ uri: item.icon }}
                    style={styles.icon}
                />
                <Text numberOfLines={1} style={styles.label}>
                    {item.label}
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
    },
    sub: {
        marginTop: 5,
        color: '#555',
    },
    empty: {
        fontSize: 16,
        color: '#777',
    },
});
