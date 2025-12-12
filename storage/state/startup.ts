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
      
    console.log(isParentProfileCompleted);

     const isKidProfileCompleted = kidDraft.getBoolean("isKidProfileCompleted") ?? false
    
    console.log(isKidProfileCompleted);

    const defaultLauncher = await isDefaultLauncher();
    console.log(defaultLauncher);


    return {
        isParentProfileCompleted,
        isDefaultLauncher: defaultLauncher,
        isKidProfileCompleted
    };
};
