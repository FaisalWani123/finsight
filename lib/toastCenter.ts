import { BackendResponse } from "@/app/backend/types/General";
import toast from "react-hot-toast";

export function toastCenter<T>(response: BackendResponse<T>) {
    if(!response.success) {
      return toast.error(response.message);
    }
    return toast.success(response.message);
  }