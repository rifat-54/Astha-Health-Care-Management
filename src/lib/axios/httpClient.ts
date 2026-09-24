import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

const axiosInstance=()=>{
    const instance=axios.create({
        baseURL: `${API_BASE_URL}/api/v1/`,
        timeout: 30000,
        headers: {
            contentType:'application/json',
        }
    })
    return instance;
}

export interface IApiRequestOptions{
    params?:Record<string,unknown>,
    headers?:Record<string,string>
}

const httpGet=async(endpoint:string,options?:IApiRequestOptions)=>{
    try {
        const response=await axiosInstance().get(endpoint,{
            params:options?.params,
            headers:options?.headers
        })
        return response.data;
    } catch (error) {
        console.error(`GET request to ${endpoint} failded`,error)
        throw error
    }
}

const httpPost=async(endpoint:string,data:unknown,options?:IApiRequestOptions)=>{
    try {
        const response=await axiosInstance().post(endpoint,data,{
            params:options?.params,
            headers:options?.headers
        })
        return response;
    } catch (error) {
        console.error(`POST request to ${endpoint} failed:`,error)
    }
}

const httpPut=async(endpoint:string,data:unknown,options?:IApiRequestOptions)=>{
    try {
        const response=await axiosInstance().put(endpoint,data,{
            params:options?.params,
            headers:options?.headers
        })
        return response;
    } catch (error) {
        console.error(`PUT request to ${endpoint} failed:`,error)
    }
}

const httpPatch=async(endpoint:string,data:unknown,options?:IApiRequestOptions)=>{
    try {
        const response=await axiosInstance().patch(endpoint,data,{
            params:options?.params,
            headers:options?.headers
        })
        return response;
    } catch (error) {
        console.error(`PATCH request to ${endpoint} failed:`,error)
    }
}

const httpDelete=async(endpoint:string,options?:IApiRequestOptions)=>{
    try {
        const response=await axiosInstance().delete(endpoint,{
            params:options?.params,
            headers:options?.headers
        })
        return response;
    } catch (error) {
        console.error(`DELETE request to ${endpoint} failed:`,error)
    }
}

export const httpClient={
    get:httpGet,
    post:httpPost,
    put:httpPut,
    patch:httpPatch,
    delete:httpDelete
}




