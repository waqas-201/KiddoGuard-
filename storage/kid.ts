import { AppItem } from "@/app/screens/kidflow/SafeAppsSelection";
import { createMMKV } from "react-native-mmkv";

export const kidDraft = createMMKV({
    id: 'kid-draft',
    readOnly: false
})





export const kidSafeAppsStore = createMMKV({
    id: 'kid-safe-apps-store',
    readOnly: false
})  




export function saveKidSafePackages(packages: AppItem[]) {
    kidSafeAppsStore.set("kidSafePackages", JSON.stringify(packages));
}

export function getKidSafePackages(): AppItem[] {
    const raw = kidSafeAppsStore.getString("kidSafePackages");
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}


