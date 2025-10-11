import { BackendResponse } from "../types/General";
import { OnBoardUserRequest, PublicSchemaUser } from "../types/User";
import { buildError, buildSuccess } from "../build/general";
import { createClient } from "@/lib/supabase/client";

export async function checkUsernameAvailabilityFromClient(username: string): Promise<BackendResponse<boolean>>{
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("user")
        .select("*")
        .eq("username", username)
        .maybeSingle()
    
    if (error){
        return buildError<boolean>(error.message);
    }

    if (!data){
        return buildSuccess("username available", true)
    }

    return buildSuccess("username taken", false)
}

export async function getUserByIdFromClient(userId: string): Promise<BackendResponse<PublicSchemaUser>>{
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("user")
        .select("*")
        .eq("userId", userId)
        .single<PublicSchemaUser>()
    
    if (error) {
        return buildError<PublicSchemaUser>(error.message)
    }

    return buildSuccess<PublicSchemaUser>("found user by id", data)
}

export async function onboardUser(request: OnBoardUserRequest): Promise<BackendResponse<PublicSchemaUser>>{
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("user")
        .insert({
            userId: request.userId,
            email: request.email,
            firstName: request.firstName,
            lastName: request.lastName,
            username: request.username,
            age: request.age,
            isMale: request.isMale,
        })
        .select("*")
        .single<PublicSchemaUser>();

    if (error) return buildError("could not onboard user"); 

    return buildSuccess("User onboarded", data)
}