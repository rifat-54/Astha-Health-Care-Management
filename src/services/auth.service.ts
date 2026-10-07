"use server"
import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers"

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function getNewTokensWithRefreshToken(refreshToken  : string) : Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Cookie : `refreshToken=${refreshToken}`
            }
        });

        if(!res.ok){
            return false;
        }

        const {data} = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if(accessToken){
            await setTokenInCookies("accessToken", accessToken);
        }

        if(newRefreshToken){
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if(token){
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export const getUserInfo=async()=>{
    try {
        const cookieStore=await cookies()
        const accessToken=cookieStore.get("accessToken")?.value

        if(!accessToken){
            return null
        }
         const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

      console.log("cookie header+>",cookieHeader)

        const res=await fetch(`${BASE_API_URL}/auth/me`,{
            method:"GET",
            // credentials:"include",
            headers:{
                "Content-Type":"application/json",
                // Cookie:`accessToken=${accessToken}`
                Cookie:cookieHeader
            }
        })

        if(!res.ok){
            console.error("Failed to fatch user info",res.status,res.statusText)
        }

        const {data}=await res.json()

        console.log("UserInfo auth service_>",data)

        return data;


    } catch (error) {
        console.error("Error fatching user info",error)
        return null
    }
}