import { BackendResponse } from "../types/General"

export function buildError<T>(message: string): BackendResponse<T>{
    return {
        success: false,
        message: message,
        data: undefined,
    }
}

export function buildSuccess<T>(message: string, data: T): BackendResponse<T>{
    return {
        success: true,
        message: message, 
        data: data as T
    }
}