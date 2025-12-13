import { isDefaultLauncher } from "@/modules/expo-launcher";
import { parentDraft } from "@/storage/Parent";
import { kidDraft } from "../kid";

export type StartupState = {
    isParentProfileCompleted: boolean;
    isKidProfileCompleted: boolean;
    isDefaultLauncher: boolean;
};

export const loadStartupState = async (): Promise<StartupState> => {
    console.log("start up  is started ");



    const isParentProfileCompleted = parentDraft.getBoolean("IsParentProfileCompleted") ?? false;
    console.log('isParentProfileCompleted', isParentProfileCompleted);
    const isKidProfileCompleted = kidDraft.getBoolean("isKidProfileCompleted") ?? false
    console.log("isKidProfileCompleted ", isKidProfileCompleted);
    const defaultLauncher = await isDefaultLauncher();
    console.log("isdefault launcher ", defaultLauncher);



    return {
        isParentProfileCompleted,
        isDefaultLauncher: defaultLauncher,
        isKidProfileCompleted
    };
};
