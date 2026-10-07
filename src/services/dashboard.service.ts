"use server"

import { httpClient } from "@/lib/axios/httpClient"
import { IAdminDashboardData } from "@/types/dashboard.types";


export const getDashboardData=async()=>{
    try {
        const response=await httpClient.get<IAdminDashboardData>("/stats")
        return response;
    } catch (error) {
        console.log("Error fetching dashboard data:", error);
        return{
            success:false,
            message:"Failed to fetch dashboard data",
            data:null,
            meta:null
        }
    }
}