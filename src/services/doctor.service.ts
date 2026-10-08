"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IDoctor } from "@/types/doctor.types";



export const getDoctors = async () => {
    try {
        const doctors = await httpClient.get<IDoctor[]>('/doctor');
        console.log("get all doctor: ",doctors)
        return doctors;

    } catch (error) {
        console.log("Error fetching doctors:", error);
        throw error;
    }
}