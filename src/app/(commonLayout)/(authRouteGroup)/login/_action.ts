/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ILoginResponse } from "@/src/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";


export const loginAction=async(payload:ILoginPayload):Promise<ILoginResponse | ApiErrorResponse>=>{

    const parsePayload=loginZodSchema.safeParse(payload)

    if(!parsePayload.success){
        const firstError=parsePayload.error.issues[0].message || "Invalid input"

        return{
            success:false,
            message:firstError
        }
    }

    try {
        const response=await httpClient.post<ILoginResponse>("/auth/login",parsePayload.data)

        console.log(response.data)

        const{accessToken,refreshToken,token}=response.data

    } catch (error:any) {
        return {
            success: false,
            message: `Login failed: ${error.message}`,
        }
        
    }

}