import { createClient } from "@/lib/supabase/server";
import { BackendResponse } from "../types/General";
import { PublicSchemaUser } from "../types/User";
import { buildError, buildSuccess } from "../build/general";

export async function getUserByIdFromServer(userId: string): Promise<BackendResponse<PublicSchemaUser>>{
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("user")
        .select("*")
        .eq("userId", userId)
        .single()
    
    if (error) {
        return buildError<PublicSchemaUser>("Could not find user")
    }

    return buildSuccess<PublicSchemaUser>("found user by id", data)
}