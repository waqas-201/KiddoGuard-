import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

interface Props {
    onParentUnlock: () => void;
}

export default function TimesUpScreen() {

    // 1. DISABLE BACK BUTTON: Prevent "Backing out" of the lock
    // useEffect(() => {
    //     const onBackPress = () => true; // Returning true stops the event
    //     BackHandler.addEventListener("hardwareBackPress", onBackPress);
    //     return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    // }, []);

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name="timer-off" size={100} color="#ff5252" />

            <Text style={styles.title}>Time is Up!</Text>
            <Text style={styles.subtitle}>
                You've used all your screen time for today.{"\n"}
                Come back tomorrow!
            </Text>

            <Button
                mode="outlined"
                // onPress={onParentUnlock}
                style={styles.btn}
            >
                Parent Unlock
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212", padding: 20 },
    title: { color: "white", fontSize: 28, fontWeight: "bold", marginTop: 20 },
    subtitle: { color: "#aaa", fontSize: 16, textAlign: "center", marginTop: 10, marginBottom: 40 },
    btn: { borderColor: "#555", width: "80%" }
});