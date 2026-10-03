"use server"
import { cookies } from "next/headers"

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

    //   console.log("cookie header+>",cookieHeader)

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

        return data;


        // console.log("from auth service_>",data)
    } catch (error) {
        console.error("Error fatching user info",error)
        return null
    }
}