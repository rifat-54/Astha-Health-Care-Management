"use server"

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";


export const loginAction=async(payload:ILoginPayload,redirectPath?:string):Promise<ILoginResponse | ApiErrorResponse>=>{

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

        const{accessToken,refreshToken,token,user}=response.data

        await setTokenInCookies("accessToken",accessToken)
        await setTokenInCookies("refreshToken",refreshToken)
        await setTokenInCookies("better-auth.session_token",token)


        
        const{needPasswordChange,email,role}=user
        if(needPasswordChange){
            redirect(`/reset-password?email=${email}`)
        }
        
          const targetPath = redirectPath && isValidRedirectForRole(redirectPath, role as UserRole) ? redirectPath : getDefaultDashboardRoute(role as UserRole);
        
        redirect(targetPath)
        
        // redirect("/")

    } catch (error:any) {

        console.log("error=> ",error)
        if(error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
            throw error;
        }

        if (error && error.response && error.response.data.message === "Email not verified") {
            redirect(`/verify-email?email=${payload.email}`);
        }


        return {
            success: false,
            message: `Login failed: ${error.message}`,
        }

    }


}