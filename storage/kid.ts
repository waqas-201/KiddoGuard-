import { createMMKV } from "react-native-mmkv";

export const kidDraft = createMMKV({
    id: 'kid-draft',
    readOnly: false
})





export const kidSafeAppsStore = createMMKV({
    id: 'kid-safe-apps-store',
    readOnly: false
})  




export function saveKidSafePackages(packages: string[]) {
    kidSafeAppsStore.set("kidSafePackages", JSON.stringify(packages));
}

export function getKidSafePackages(): string[] {
    const raw = kidSafeAppsStore.getString("kidSafePackages");
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}