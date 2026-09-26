"use server"

import jwt, { JwtPayload } from "jsonwebtoken"
import { setCookie } from "./cookieUtils"

const JWT_ACCESS_SECRET=process.env.JWT_ACCESS_SECRET

const getTokenSecondRemaining=(token:string):number=>{

    if(!token) return 0

    try {
        const tokenPayload=JWT_ACCESS_SECRET?jwt.verify(token,JWT_ACCESS_SECRET) as JwtPayload:jwt.decode(token) as JwtPayload

        if(tokenPayload &&! tokenPayload.exp){
            return 0;
        }
        const remainingSecond=tokenPayload.exp as number -Math.floor(Date.now()/1000)
        return remainingSecond>0?remainingSecond:0

    } catch (error) {
        console.error("Error decoding token",error)
        return 0
    }
}

export const setTokenInCookies=async(name:string,token:string,fallbackMaxAgeInSecond=60*60*24 )=>{
    const maxAgeInSecond=getTokenSecondRemaining(token)

    await setCookie(name,token,maxAgeInSecond || fallbackMaxAgeInSecond)
}