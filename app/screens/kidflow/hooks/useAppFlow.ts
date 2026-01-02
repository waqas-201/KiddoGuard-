import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppItem, AppSafetyService } from "../../../../services/kid/appSafety.service";

export type Step = "loading" | "classifying" | "review" | "error";

export function useAppFlow() {
    const [step, setStep] = useState<Step>("loading");
    const [progress, setProgress] = useState(0);
    const [finalApps, setFinalApps] = useState<AppItem[]>([]);

    // Phase 1: Scan local apps
    const scanQuery = useQuery({
        queryKey: ["installed-apps"],
        queryFn: () => AppSafetyService.fetchInstalledApps(setProgress),
        staleTime: Infinity,
    });

    // Phase 2: Classify via API
    const classifyMutation = useMutation({
        mutationFn: AppSafetyService.classifyApps,
        onSuccess: (results) => {
            const safeSet = new Set(results.filter((r: any) => r.isKidSafe).map((r: any) => r.packageName));

            const merged = (scanQuery.data || []).map(app => ({
                ...app,
                isKidSafe: safeSet.has(app.packageName)
            }));

            setFinalApps(merged);
            setStep("review");
            setProgress(1);
        },
        onError: () => setStep("error")
    });

    // Orchestration: When scan finishes, start classification
    useEffect(() => {
        if (scanQuery.data && step === "loading") {
            setStep("classifying");
            classifyMutation.mutate(scanQuery.data);
        }
    }, [scanQuery.data]);

    const toggleApp = (pkg: string) => {
        setFinalApps(prev => prev.map(a =>
            a.packageName === pkg ? { ...a, isKidSafe: !a.isKidSafe } : a
        ));
    };

    return {
        step,
        progress,
        apps: finalApps,
        toggleApp,
        retry: () => {
            setStep("loading");
            scanQuery.refetch();
        }
    };
}