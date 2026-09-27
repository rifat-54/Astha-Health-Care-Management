"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";


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

        await setTokenInCookies("accessToken",accessToken)
        await setTokenInCookies("refreshToken",refreshToken)
        await setTokenInCookies("better-auth.session_token",token)


            redirect("/")

        

    } catch (error:any) {

        console.log("error=> ",error)
         if(error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
        throw error;
    }
        return {
            success: false,
            message: `Login failed: ${error.message}`,
        }

    }


}