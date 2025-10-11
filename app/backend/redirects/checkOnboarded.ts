
import { buildError, buildSuccess } from "../build/general";
import { BackendResponse } from "../types/General";
import { PublicSchemaUser } from "../types/User";
import { getUserByIdFromServer } from "../user/serverActions";
import { getAuthUser } from "./checkUser";
import { User } from "@supabase/supabase-js";


export async function checkOnboarded(): Promise<BackendResponse<boolean>>{
    const authUser: User = await getAuthUser();
    const authUserId: string = authUser.id

    if (!authUserId) {
        return buildError<boolean>("no authenticated user") // no authenticated user
    }

    const response: BackendResponse<PublicSchemaUser> = await getUserByIdFromServer(authUserId)

    if (!response.success){
        return buildError<boolean>("get user by id was unsuccessful");
    }

    if (response.data === undefined || response.data === null){
        return buildSuccess<boolean>("user profile not set", false)
    }

    return buildSuccess<boolean>("user onboarded", true)

    
}