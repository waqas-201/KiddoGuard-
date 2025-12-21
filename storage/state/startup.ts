import { db } from "@/db/db";
import { childTable, parentTable } from "@/db/schema";
import { isDefaultLauncher } from "@/modules/expo-launcher";

export type StartupState = {
    isParentProfileCompleted: boolean;
    isKidProfileCompleted: boolean;
    isDefaultLauncher: boolean;
};

export const loadStartupState = async (): Promise<StartupState> => {
    console.log("start up  is started ");
    const parent = await db.select().from(parentTable).get()
    const kid = await db.select().from(childTable).get()

    const isParentProfileCompleted = parent?.isParentProfileCompleted ?? false;
    console.log('isParentProfileCompleted', isParentProfileCompleted);
    const isKidProfileCompleted = kid?.isKidProfileCompleted ?? false

    console.log("isKidProfileCompleted ", isKidProfileCompleted);
    const defaultLauncher = await isDefaultLauncher();
    console.log("isdefault launcher ", defaultLauncher);



    return {
        isParentProfileCompleted,
        isDefaultLauncher: defaultLauncher,
        isKidProfileCompleted
    };
};
