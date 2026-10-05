
import { ApiResponse } from '@/types/api.types';
import axios from 'axios';
import { isTokenExpireingSoon } from '../tokenUtils';
import { cookies, headers } from 'next/headers';
import { getNewTokensWithRefreshToken } from '@/services/auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

const tryRefreshToken=async(accessToken:string,refreshToken:string):Promise<void>=>{
    if(!isTokenExpireingSoon(accessToken)){
        return;
    }

    const requestHeader=await headers()

    if(requestHeader.get("x-token-refreshed")==="1"){
        return
    }

    try {
        await getNewTokensWithRefreshToken(refreshToken)
    } catch (error) {
     console.error("Error refreshing token in http client",error)   
    }
}


const axiosInstance=async()=>{
    const cookieStore=await cookies()

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if(accessToken&& refreshToken){
        await tryRefreshToken(accessToken,refreshToken)
    }

    const cookieHeader=cookieStore.getAll().map((cookie)=>`${cookie.name}=${cookie.value}`).join("; ")


    const instance=axios.create({
        baseURL:API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type":'application/json',
            Cookie:cookieHeader
        }
    })
    return instance;
}

export interface IApiRequestOptions{
    params?:Record<string,unknown>,
    headers?:Record<string,string>
}

const httpGet=async<TData>(endpoint:string,options?:IApiRequestOptions):Promise<ApiResponse<TData>>=>{
    try {
        const response=await (await axiosInstance()).get<ApiResponse<TData>>(endpoint,{
            params:options?.params,
            headers:options?.headers
        })
        return response.data;
    } catch (error) {
        console.error(`GET request to ${endpoint} failded`,error)
        throw error
    }
}

const httpPost=async<TData>(endpoint:string,data:unknown,options?:IApiRequestOptions):Promise<ApiResponse<TData>>=>{
    try {
        const response=await (await axiosInstance()).post<ApiResponse<TData>>(endpoint,data,{
            params:options?.params,
            headers:options?.headers
        })
        return response.data;
    } catch (error) {
        console.error(`POST request to ${endpoint} failed:`,error)
        throw error
    }
}

const httpPut=async<TData>(endpoint:string,data:unknown,options?:IApiRequestOptions):Promise<ApiResponse<TData>>=>{
    try {
        const response=await (await axiosInstance()).put<ApiResponse<TData>>(endpoint,data,{
            params:options?.params,
            headers:options?.headers
        })
        return response.data;
    } catch (error) {
        console.error(`PUT request to ${endpoint} failed:`,error)
        throw error
    }
}

const httpPatch=async<TData>(endpoint:string,data:unknown,options?:IApiRequestOptions):Promise<ApiResponse<TData>>=>{
    try {
        const response=await (await axiosInstance()).patch<ApiResponse<TData>>(endpoint,data,{
            params:options?.params,
            headers:options?.headers
        })
        return response.data;
    } catch (error) {
        console.error(`PATCH request to ${endpoint} failed:`,error)
        throw error
    }
}

const httpDelete=async<TData>(endpoint:string,options?:IApiRequestOptions):Promise<ApiResponse<TData>>=>{
    try {
        const response=await (await axiosInstance()).delete<ApiResponse<TData>>(endpoint,{
            params:options?.params,
            headers:options?.headers
        })
        return response.data;
    } catch (error) {
        console.error(`DELETE request to ${endpoint} failed:`,error)
        throw error
    }
}

export const httpClient={
    get:httpGet,
    post:httpPost,
    put:httpPut,
    patch:httpPatch,
    delete:httpDelete
}




