import { openApp } from '@/modules/expo-launcher';
import { RootState } from '@/store';
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useLauncherData } from './hooks/useLauncherData';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
// Calculate spacing dynamically
const SPACING = 16;
const TILE_SIZE = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

export default function LauncherScreen() {

    const role = useSelector((state: RootState) => state.session.currentUser?.role)
    const { apps, ready } = useLauncherData({ role });
    const fadeAnim = useRef(new Animated.Value(0)).current;
    console.log(apps.length);

    useEffect(() => {
        if (ready) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [ready]);

    if (!ready) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.headerTitle}>Safe Apps</Text>

                <FlashList
                    data={apps}
                    keyExtractor={(item) => item.packageName}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.listPadding}
                    renderItem={({ item }) => (
                        <AppTile
                            item={item}
                            onPress={() => openApp(item.packageName)}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text style={styles.emptyText}>No apps available.</Text>
                        </View>
                    }
                />
            </Animated.View>
        </SafeAreaView>
    );
}

function AppTile({ item, onPress }: { item: any, onPress: () => void }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
    // Snappy visual feedback
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]).start(() => onPress());
    };

    const iconUri = item.icon?.startsWith('data:image')
        ? item.icon
        : `data:image/png;base64,${item.icon}`;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            style={styles.tileWrapper}
        >
            <Animated.View style={[styles.tile, { transform: [{ scale }] }]}>
                <Image source={{ uri: iconUri }} style={styles.icon} />
                <Text numberOfLines={1} style={styles.appName}>
                    {item.appName}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A1A1A',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listPadding: {
        paddingHorizontal: SPACING,
        paddingBottom: 40,
    },
    tileWrapper: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 24,
    },
    tile: {
        alignItems: 'center',
    },
    icon: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        borderRadius: TILE_SIZE * 0.22, // Dynamic squircle
        backgroundColor: '#F3F4F6',
    },
    appName: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        textAlign: 'center',
        width: TILE_SIZE,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 16,
    },
});