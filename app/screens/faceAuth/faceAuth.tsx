import { useStartup } from "@/app/navigation/StartupContext";
import { db } from "@/db/db";
import { childTable } from "@/db/schema";
import { setUser } from "@/features/sessionSlice";
import { getImageEmbeddingAsync, loadModelAsync } from "@/modules/expo-face-embedder";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor,
    Camera as VisionCamera,
} from "react-native-vision-camera";
import { Face, FrameFaceDetectionOptions, useFaceDetector } from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";
import { useDispatch } from "react-redux";
import { PermissionService } from '../../../services/kid/PermissionService';
import { startChildTimer } from '../../../services/timeLimit/timeSync';

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return NaN;

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return NaN;

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default function FaceAuth() {
    const device = useCameraDevice("front");
    const { hasPermission, requestPermission } = useCameraPermission();
    const cameraRef = useRef<VisionCamera>(null);
    const lastProcessed = useRef(0);
    const [message, setMessage] = useState("Align your face to unlock...");
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"idle" | "recognizing" | "success" | "failed">("idle");
    const dispatch = useDispatch()
    const { refreshStartup } = useStartup()



    const faceOptions: FrameFaceDetectionOptions = {
        performanceMode: "accurate",
        landmarkMode: "all",
        classificationMode: "all",
        contourMode: "none",
        minFaceSize: 0.15,
        trackingEnabled: false,
        autoMode: false,
    };

    const { detectFaces, stopListeners } = useFaceDetector(faceOptions);

    useEffect(() => {
        (async () => {
            if (!hasPermission) await requestPermission();
            await loadModelAsync();
            setLoading(false);
            setStatus("idle");
        })();

        return () => stopListeners();
    }, [hasPermission]);


    const handleDetectedFaces = Worklets.createRunOnJS(async (faces: Face[]) => {
        if (faces.length === 0 || status !== "idle") return;

        const face = faces[0];
        const leftEye = face.landmarks?.LEFT_EYE;
        const rightEye = face.landmarks?.RIGHT_EYE;

        if (!leftEye || !rightEye) {
            setMessage("Make sure both eyes are visible in frame.");
            return;
        }

        const leftOpen = face.leftEyeOpenProbability ?? 0;
        const rightOpen = face.rightEyeOpenProbability ?? 0;

        if (leftOpen < 0.6 || rightOpen < 0.6) {
            setMessage("👁 Keep your eyes open and look straight.");
            return;
        }

        /* ============================
           FACE GEOMETRY VALIDATION
           ============================ */
        const frameWidth = 720;
        const frameHeight = 960;

        const { width, height, x, y } = face.bounds;
        const coverage = width / frameWidth;

        const centerX = x + width / 2;
        const centerY = y + height / 2;

        const offsetX = Math.abs(centerX - frameWidth / 2) / frameWidth;
        const offsetY = Math.abs(centerY - frameHeight / 2) / frameHeight;

        const eyeDistance = Math.abs(leftEye.x - rightEye.x);
        const relativeEyeDistance = eyeDistance / width;

        if (relativeEyeDistance < 0.2) {
            setMessage("Move a bit closer — face too small.");
            return;
        }

        if (coverage < 0.35) {
            setMessage("Bring your full face into the frame.");
            return;
        }

        if (coverage > 0.7) {
            setMessage("You're too close — move slightly back.");
            return;
        }

        if (offsetX > 0.25 || offsetY > 0.25) {
            setMessage("Center your face in the frame.");
            return;
        }

        /* ============================
           START RECOGNITION
           ============================ */
        setStatus("recognizing");
        setMessage("Analyzing face...");

        try {
            const photo = await cameraRef.current?.takePhoto();
            if (!photo) {
                setStatus("idle");
                return;
            }

            const currentEmbedding = await getImageEmbeddingAsync(photo.path);
            const THRESHOLD = 0.60;
            /* ============================
                           1️⃣ TRY PARENT FIRST
                           ============================ */
            // const parent = await db.select().from(parentTable).get();
            // let parentMatched = false;

            // if (parent?.embedding) {
            //     const parentEmbedding: number[][] = JSON.parse(parent.embedding);



            //     for (const emb of parentEmbedding) {
            //         const score = cosineSimilarity(currentEmbedding, emb);
            //         console.log("🧠 Parent similarity:", score);

            //         if (!Number.isNaN(score) && score >= THRESHOLD) {
            //             parentMatched = true;
            //             break;
            //         }
            //     }

            //     if (parentMatched) {
            //         console.log("👨 Parent matched:", parent);
            //         dispatch(setUser({
            //             id: parent.id,
            //             role: "parent",
            //             name: parent.name
            //         }));
            //         refreshStartup()
            //         setStatus("success");

            //         setMessage("✅ Parent recognized");
            //         return;
            //     }


            // }

            /* ============================
               2️⃣ TRY CHILDREN
               ============================ */
            const childs = await db.select().from(childTable);

            for (const child of childs) {
                const childEmbeddings: number[][] = JSON.parse(child.embedding);

                for (const emb of childEmbeddings) {
                    const score = cosineSimilarity(currentEmbedding, emb);
                    console.log(`🧠 Child(${child.name}) similarity:`, score);

                    if (!Number.isNaN(score) && score >= THRESHOLD) {
                        console.log("🧒 Child matched:", child);

                        setStatus("success");
                        // after matching child
                        dispatch(setUser({
                            id: child.id,
                            role: "child",
                            name: child.name,
                            age: child.age,
                            timeLimit: child.dailyLimitSeconds,
                            parentId: child.parentId
                        }));
                        const apps = await PermissionService.ensurePermissionsCached();
                        console.log(apps);

                        await startChildTimer(child.id);

                        setMessage(`✅ ${child.name} recognized`);
                        refreshStartup()

                        return;
                    }
                }
            }


            /* ============================
               3️⃣ NO MATCH
               ============================ */
            setStatus("failed");
            setMessage("❌ Face not recognized");

            setTimeout(() => {
                setStatus("idle");
                setMessage("Align your face to unlock...");
            }, 100);
        } catch (error) {
            console.error("Face recognition error:", error);
            setStatus("failed");
            setMessage("Recognition error");
        }
    });

    const frameProcessor = useFrameProcessor((frame) => {
        "worklet";
        const now = Date.now();
        if (now - lastProcessed.current < 2000) return;
        lastProcessed.current = now;

        const faces = detectFaces(frame);
        if (faces.length > 0) {
            Worklets.createRunOnJS(handleDetectedFaces)(faces);
        }
    }, [detectFaces]);

    if (loading || !device)
        return <CenteredMessage message="Loading camera..." />;

    if (!hasPermission)
        return <CenteredMessage message="Camera access required" action={requestPermission} />;

    return (
        <SafeAreaView style={styles.container}>
            <VisionCamera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                photo={true}
            />

            <View style={styles.overlay}>
                <Text style={styles.title}>Face Unlock</Text>
                <Text style={styles.message}>{message}</Text>
                {status === "recognizing" && (
                    <ActivityIndicator color="lightgreen" style={{ marginTop: 10 }} />
                )}
            </View>
        </SafeAreaView>
    );
}

const CenteredMessage = ({
    message,
    action,
}: {
    message: string;
    action?: () => void;
}) => (
    <View style={styles.centered}>
        <Text>{message}</Text>
        {action && <Text onPress={action} style={{ color: "blue" }}>Grant Permission</Text>}
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "black" },
    camera: { ...StyleSheet.absoluteFillObject },
    overlay: {
        position: "absolute",
        bottom: 80,
        width: "100%",
        alignItems: "center",
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
    },
    message: {
        color: "#ccc",
        textAlign: "center",
        fontSize: 14,
        paddingHorizontal: 20,
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});