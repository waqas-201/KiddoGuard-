import { db } from "@/db/db";
import { parentTable } from "@/db/schema";



export const getParentEmbeddings = async () => {
   

        const result = await db.select().from(parentTable).get()
        return result?.embedding
        
         
   
}