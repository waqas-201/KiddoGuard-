import { useTabsNavigation } from "@/app/navigation/hooks";
import React from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const kids = [
    {
        name: "Aisha Khan",
        age: 7,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBneh8-LRZP54oqrKd8siAxZDI1bXCXCxj2cV2J_G1mBrz3kcfaUM9jhSwTD86dKZavnx3wQ0l0YQqIb9fg3O3q99-N_tRuaVOLMK8fuqJLIayo6tNJwHBLSiY0NLwTk_l6cSw30bfdQC4Fo0eNeitXElX_49-hePYjyJpvY0BTml72RPPloNZ8ncdqPJN6xCpVRXgP5xQ5mVBscixckhQ8Qgr0hy568XAbBdgETmMgNPemafcohfAEyKBG6cHODqgcy192mV_ElSs",
        status: "Launcher Ready",
        statusColor: "#00e054",
    },
    {
        name: "Zain Malik",
        age: 5,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3atcN4lY0XBp3JL77GF50K0ZmUF8iv57ljp8LvYYpz-81qzH1atSYp5bPCja2CMrDNXuji5rjUIFMAypEqsHTrvE_XJ6I_SqC2xw-Z8Pjg2-mW9jscP2ijNmgZyk7jvvmM-lfpCWEZKQCULc7ZuPPFipuEX3oR5iOC5p6kXaPoJ1SMIMi69GRJSAPEV5x4LBPlB5-U3xg3TtsQV5WpXJqA3tLx2ShIPomrTXWLECR6cRGVudkymInuUDyphfFdcqQXMBqbP4U6Tw",
        status: "Setup Incomplete",
        statusColor: "#FACC15",
    },
    {
        name: "Fatima Ali",
        age: 9,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP_JvCCR7Im-HFNJTEteHMEwTlCOTbKYI2KX_Mo2VeEt4QDR-jvjM18jIp1uX-Zmf-S-JwMhyt-VILzyu9_R87yyvVvd74mUeo2XXNmYPn_y1M-PXVKAXr5HpnT3tpvJ2ckMTSyszUxHlhi0DqyK9FzrB_jyI-RNfDnEV_EUt245kIKOgrttqB7VP-QWGlTgz1v6L_80-pkZtlXzpDPbwsW0sDtG8An-w9KYlW8Z2v6E4BwVtkyfN72oLKbSfwE00fK5uCYInd2YI",
        status: "Setup Incomplete",
        statusColor: "#FACC15",
    },
];

export default function KidsTab() {
const  navigation = useTabsNavigation()
    const handleKidPress = (kidName: string) => {
        // Navigate to kid settings screen
        // Pass kid name as a param if needed
       ;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Kids</Text>
            </View>

            {/* Main content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {kids.map((kid, index) => (
                    <TouchableOpacity key={index} onPress={() => handleKidPress(kid.name)}>
                        <Card style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.kidInfo}>
                                    <Image source={{ uri: kid.image }} style={styles.kidImage} />
                                    <View>
                                        <Text style={styles.kidName}>{kid.name}</Text>
                                        <Text style={styles.kidAge}>Age {kid.age}</Text>
                                    </View>
                                </View>
                                <View style={styles.statusContainer}>
                                    <View style={[styles.statusDot, { backgroundColor: kid.statusColor }]} />
                                    <Text style={[styles.statusText, { color: kid.statusColor }]}>{kid.status}</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}

                <Button
                    mode="outlined"
                    style={styles.addButton}
                    textColor="#a0b8a4"
                    icon="plus-circle"
                    onPress={() => {
                        
                    }}
                >
                    Add New Kid
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111812",
    },
    header: {
        padding: 16,
        backgroundColor: "#111812",
    },
    headerText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        marginBottom: 12,
        borderRadius: 14,
        backgroundColor: "#1c261e",
        minHeight: 80,
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    kidInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    kidImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    kidName: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    kidAge: {
        color: "#a0b8a4",
        fontSize: 14,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    statusText: {
        fontWeight: "500",
        fontSize: 14,
    },
    addButton: {
        marginTop: 12,
        borderRadius: 16,
        borderColor: "#29382c",
        backgroundColor: "#1c261e",
        paddingVertical: 16,
        justifyContent: "center",
    },
});
