import { isDefaultLauncher } from "@/modules/expo-launcher";
import { parentDraft } from "@/storage/Parent";
import { kidDraft } from "../kid";

export type StartupState = {
    isParentProfileCompleted: boolean;
    isKidProfileCompleted: boolean;
    isDefaultLauncher: boolean;
};

export const loadStartupState = async (): Promise<StartupState> => {
    const isParentProfileCompleted =
        parentDraft.getBoolean("IsParentProfileCompleted") ?? false;
      
     const isKidProfileCompleted = kidDraft.getBoolean("isKidProfileCompleted") ?? false
    
    const defaultLauncher = await isDefaultLauncher();

    return {
        isParentProfileCompleted,
        isDefaultLauncher: defaultLauncher,
        isKidProfileCompleted
    };
};
