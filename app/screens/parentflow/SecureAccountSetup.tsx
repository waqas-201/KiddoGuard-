import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Camera as VisionCamera,
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor,
} from "react-native-vision-camera";
import { FrameFaceDetectionOptions, useFaceDetector } from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";

import { useParentFlowNavigation, useRootNavigation } from "@/app/navigation/hooks";
import { getImageEmbeddingAsync, loadModelAsync, logImageUriAsync } from "@/modules/expo-face-embedder";
import { parentDraft } from "@/storage/Parent";

export default function SecureAccountSetup() {
    const rootNavigation = useRootNavigation()
    const navigation = useParentFlowNavigation()
    const device = useCameraDevice("front");
    const { hasPermission, requestPermission } = useCameraPermission();
    const cameraRef = useRef<VisionCamera>(null);

    const captureCount = useRef(0);
    const lastCapture = useRef(0);
    const scanning = useRef(false);

    const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState<string>("");

    const isFocused = useIsFocused(); // ✅ screen focus detection

    const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
        performanceMode: "accurate",
        landmarkMode: "all",
        classificationMode: "all",
        contourMode: "none",
        minFaceSize: 0.15,
        trackingEnabled: false,
        autoMode: false,
    }).current;

    const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

    // Request camera permission
    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission]);

    // Clean up listeners on unmount
    useEffect(() => {
        return () => stopListeners();
    }, []);


    // insert data to db 


    const captureFacePhotoAndGenerateEmbeddings = async () => {
        try {
            if (!cameraRef.current) return;
            const photo = await cameraRef.current.takePhoto();
            if (!photo) return;

            console.log("✅ Photo captured:", photo.path);
            await logImageUriAsync(photo.path);
            await loadModelAsync();
            const embedding = await getImageEmbeddingAsync(photo.path);

            let existingRaw = parentDraft.getString("parentFaceEmbedding");
            let existing = existingRaw ? JSON.parse(existingRaw) : [];

            if (existing.length >= 3) existing = []; // reset if already 3 embeddings

            existing.push(embedding);
            parentDraft.set("parentFaceEmbedding", JSON.stringify(existing));
            console.log(`💾 Saved embedding #${existing.length}`);
        } catch (err) {
            console.error("❌ Photo capture error:", err);
            setMessage("Something went wrong while capturing. Please try again.");
        }
    };

    const handleDetectedFaces = Worklets.createRunOnJS((faces: any) => {
        if (!isFocused) return; // ✅ stop scanning if screen is not focused
        const now = Date.now();
        if (faces.length === 0) return;

        const face = faces[0];
        const leftOpen = face.leftEyeOpenProbability ?? 1;
        const rightOpen = face.rightEyeOpenProbability ?? 1;
        const eyesOpenEnough = leftOpen > 0.5 && rightOpen > 0.5;

        if (!eyesOpenEnough) {
            if (scanning.current) {
                scanning.current = false;
                setMessage("👁 Please open both eyes to continue scanning.");
            }
            return;
        }

        if (!scanning.current) {
            scanning.current = true;
            setMessage("✅ Eyes detected — capturing face...");
        }

        if (faces.length > 0 && scanning.current && now - lastCapture.current > 2000) {
            lastCapture.current = now;
            captureCount.current += 1;
            captureFacePhotoAndGenerateEmbeddings();

            const currentProgress = (captureCount.current / 3) * 100;
            setProgress(currentProgress);

            if (captureCount.current < 3) {
                setMessage(`Capturing face ${captureCount.current} of 3...`);
            } else {
                scanning.current = false;
                captureCount.current = 0;
                setProgress(100);
                setStatus("success");
                parentDraft.set('isParentProfileCompleted', true)
                setMessage("✅ All 3 face scans completed successfully! Redirecting...");
                setTimeout(() => navigation.replace('SaveParentProfileScreen'), 1000);
            }
        }
    });

    const lastProcessed = useRef(0);
    const frameProcessor = useFrameProcessor((frame) => {
        "worklet";
        if (!isFocused) return; // ✅ stop frame processing if screen not focused
        const now = Date.now();
        if (now - lastProcessed.current < 3000) return;
        lastProcessed.current = now;

        const faces = detectFaces(frame);
        if (faces.length > 0) Worklets.createRunOnJS(handleDetectedFaces)(faces);
    }, [detectFaces, isFocused]);

    if (!device) return <CenteredMessage message="Loading camera..." />;
    if (!hasPermission)
        return <CenteredMessage message="Camera access is required to scan your face." action={requestPermission} />;

    return (
        <SafeAreaView style={styles.container}>
            <VisionCamera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={isFocused} // ✅ only active if screen focused
                frameProcessor={frameProcessor}
                photo={true}
            />
            <View style={styles.overlay}>
                {status === "idle" && <IntroContent startScan={() => {
                    scanning.current = true;
                    captureCount.current = 0;
                    setProgress(0);
                    setStatus("scanning");
                    setMessage("Hold still — scanning will capture 3 angles automatically.");
                    console.log("🚀 Started scanning...");
                }} />}
                {status === "scanning" && <ScanningContent progress={progress} message={message} />}
                {status === "success" && <SuccessContent />}
            </View>
        </SafeAreaView>
    );
}

// Helper Components
const IntroContent = ({ startScan }: { startScan: () => void }) => (
    <View style={styles.introContainer}>
        <Text style={styles.title}>Face Verification</Text>
        <Text style={styles.privacyMessage}>
            We care about your privacy. Your photos never leave your device — all face data is processed locally and securely stored.
        </Text>
        <Text style={styles.hintText}>
            Please position your face clearly in front of the camera and tap below to begin.
        </Text>
        <Button mode="contained" onPress={startScan} style={styles.startButton} labelStyle={styles.startButtonLabel}>
            Start Face Scan
        </Button>
    </View>
);

const ScanningContent = ({ progress, message }: { progress: number; message: string }) => (
    <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Scanning... {Math.round(progress)}%</Text>
        <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        {message !== "" && <Text style={styles.messageText}>{message}</Text>}
    </View>
);

const SuccessContent = () => (
    <View style={styles.successContainer}>
        <Text style={styles.successText}>✅ Face scan completed!</Text>
        <Text style={styles.redirectText}>Redirecting to your home screen...</Text>
        <ActivityIndicator style={styles.loader} animating color="lightgreen" size="small" />
    </View>
);

const CenteredMessage = ({ message, action }: { message: string; action?: () => void }) => (
    <View style={styles.centered}>
        <Text>{message}</Text>
        {action && <Button onPress={action}>Grant Permission</Button>}
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "black" },
    camera: { ...StyleSheet.absoluteFillObject },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },

    overlay: {
        position: "absolute",
        bottom: 60,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    introContainer: { alignItems: "center", paddingHorizontal: 24 },
    title: { color: "white", fontSize: 20, fontWeight: "600", marginBottom: 12 },
    privacyMessage: { color: "#A0A0A0", fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 12 },
    hintText: { color: "white", textAlign: "center", marginBottom: 16, fontSize: 14 },
    startButton: { backgroundColor: "#00C853", borderRadius: 8, paddingHorizontal: 24 },
    startButtonLabel: { color: "white", fontSize: 15, fontWeight: "500" },
    progressContainer: { alignItems: "center", marginTop: 16 },
    progressText: { color: "white", fontSize: 14 },
    progressBarBackground: { width: "80%", height: 6, backgroundColor: "#333", borderRadius: 3, marginTop: 8 },
    progressBarFill: { height: "100%", backgroundColor: "#00C853", borderRadius: 3 },
    messageText: { color: "#ccc", marginTop: 8, textAlign: "center", fontSize: 13 },
    successContainer: { alignItems: "center", marginTop: 16 },
    successText: { color: "lightgreen", fontSize: 16, fontWeight: "500" },
    redirectText: { color: "#ccc", marginTop: 4 },
    loader: { marginTop: 8 },
});
