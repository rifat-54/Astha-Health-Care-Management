"use server"

import jwt, { JwtPayload } from "jsonwebtoken"
import { setCookie } from "./cookieUtils"

const JWT_ACCESS_SECRET=process.env.JWT_ACCESS_SECRET

export const getTokenSecondRemaining=(token:string):number=>{

    if(!token) return 0

    try {
        // const tokenPayload=JWT_ACCESS_SECRET?jwt.verify(token,JWT_ACCESS_SECRET) as JwtPayload:jwt.decode(token) as JwtPayload
        const tokenPayload=jwt.decode(token) as JwtPayload

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
      let maxAgeInSecond = fallbackMaxAgeInSecond;

  if (name === "accessToken" || name === "refreshToken") {
    maxAgeInSecond = getTokenSecondRemaining(token) || fallbackMaxAgeInSecond;
  }

    await setCookie(name,token,maxAgeInSecond)
}


export async function isTokenExpireingSoon(token:string,threeholdInSecond=300){

    const remainingSeconds=getTokenSecondRemaining(token)
    // return remainingSeconds>0 && remainingSeconds<=threeholdInSecond;
    return remainingSeconds<=threeholdInSecond
}

export const isTokenExpire=(token:string)=>{
    const remainingSeconds=getTokenSecondRemaining(token)
    return remainingSeconds===0;
}