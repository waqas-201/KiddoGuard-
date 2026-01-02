// @/components/SecretGestureWrapper.tsx
import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SecretAuthModal } from './SecretAuthModal';

export const SecretGestureWrapper = ({ children }: { children: React.ReactNode }) => {
    const [authVisible, setAuthVisible] = useState(false);
    const tapCount = useRef(0);
    const lastTap = useRef(0);

    const handlePress = () => {
        const now = Date.now();
        if (now - lastTap.current < 500) {
            tapCount.current += 1;
        } else {
            tapCount.current = 1;
        }
        lastTap.current = now;

        if (tapCount.current >= 3) {
            setAuthVisible(true);
            tapCount.current = 0;
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={handlePress}
                style={StyleSheet.absoluteFill}
            >
                {children}
            </TouchableOpacity>

            <SecretAuthModal
                visible={authVisible}
                onClose={() => setAuthVisible(false)}
            />
        </View>
    );
};