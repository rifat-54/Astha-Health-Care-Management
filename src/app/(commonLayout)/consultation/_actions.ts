"use server"

import { httpClient } from "@/src/lib/axios/httpClient"

export const getDoctors=async()=>{
    const doctor=await httpClient.get("/doctor")

    console.log("Doctor","server")
    return doctor
}