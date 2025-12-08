// src/screens/LauncherScreen.tsx
import { openApp } from '@/modules/expo-launcher';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,

    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLauncherData } from './hooks/useLauncherData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TILE_SIZE = SCREEN_WIDTH / 4;

export default function LauncherScreen() {
    const { apps, ready, serviceOk } = useLauncherData();

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
            <FlatList
                data={apps}
                keyExtractor={(item) => item.packageName}
                numColumns={3}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.tile}
                        activeOpacity={0.7}
                        onPress={() => openApp(item.packageName)}
                    >
                        <Image
                            source={{ uri: item.icon }}
                            style={styles.icon}
                        />
                        <Text style={styles.label} numberOfLines={1}>
                            {item.appName}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
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
        padding: 10,
    },
    tile: {
        width: TILE_SIZE,
        height: TILE_SIZE + 20,
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
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center',
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
