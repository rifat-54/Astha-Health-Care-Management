import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { getNewTokensWithRefreshToken, getUserInfo } from "./services/auth.service";
import { isTokenExpireingSoon } from "./lib/tokenUtils";


async function refreshTokenMiddleware (refreshToken : string) : Promise<boolean> {
    try {
        const refresh = await getNewTokensWithRefreshToken(refreshToken);
        if(!refresh){
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error refreshing token in middleware:", error);
        return false;   
    }
}


export const proxy=async(request:NextRequest)=>{

    console.log("req->",request)

    const {pathname}=request.nextUrl;

    const accessToken=request.cookies.get("accessToken")?.value
    const refreshToken=request.cookies.get("refreshToken")?.value
    const token=request.cookies.get( "better-auth.session_token")?.value

    const decodedAccessToken =  accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

    const isValidAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

    let userRole=null

    if(decodedAccessToken){
        userRole=decodedAccessToken.role
    }

    const routeOwner=getRouteOwner(pathname)

    const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;
    userRole = unifySuperAdminAndAdminRole;

    const isAuth=isAuthRoute(pathname)


    if(isValidAccessToken && refreshToken && (await isTokenExpireingSoon(accessToken))){
        const requestHeaders=new Headers(request.headers)

        const response=NextResponse.next({
            request:{
                headers:requestHeaders
            }
        })

        try {
            const refreshed=await refreshTokenMiddleware(refreshToken)

            if(refreshed){
                requestHeaders.set("x-token-refreshed","1")
            }
            return NextResponse.next({
                request:{
                    headers:requestHeaders
                },
                headers:response.headers
            })
        } catch (error) {
            console.error("Error refreshing token",error)
        }

        return response
    }


  

      // Rule - 2 : User is trying to access reset password page
       if(pathname === "/reset-password"){
        const email=request.nextUrl.searchParams.get("email")

        // has token but need changed password
        if(accessToken){
            const userInfo=await getUserInfo()

            if(userInfo.needPasswordChange){
                return NextResponse.next()
            }else{
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole),request.url))
            }

        }

        // case for forget password has no token
        if(email){
            return NextResponse.next()
        }

        const loginUrl=new URL("/login",request.url)
        loginUrl.searchParams.set("redirect",pathname)
        return NextResponse.redirect(loginUrl)

        // console.log("req-2 >",userInfo)

       } 


       // Rule-3 User trying to access Public route -> allow
       if(routeOwner === null){
        return NextResponse.next();
       }

    //    User not login but trying to access protected route -> redirect login page
    if(!accessToken || !isValidAccessToken){
        const loginUrl=new URL("/login",request.url)
        loginUrl.searchParams.set("redirect",pathname)
        return NextResponse.redirect(loginUrl)
    }


    // if verifyemail is false or needchangePasswod is true
    if(accessToken){
        const userInfo=await getUserInfo()

        if(userInfo){

            console.log("userinfo",userInfo)
            // if  email not verify
            if(userInfo.emailVerified===false){
                if(pathname!=="/verify-email"){
                    const url=new URL("/verify-email",request.url)
                    url.searchParams.set("email",userInfo.email)
                    return NextResponse.redirect(url)
                }
                return NextResponse.next()
            }

            if(userInfo.emailVerified && pathname==="/verify-email"){
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole),request.url))
            }

            // if need change password
            if(userInfo.needPasswordChange){
                  if(pathname !== "/reset-password"){
                        const resetPasswordUrl = new URL("/reset-password", request.url);
                        resetPasswordUrl.searchParams.set("email", userInfo.email);
                        return NextResponse.redirect(resetPasswordUrl);
                    }

                    return NextResponse.next();
            }

            if(!userInfo.needPasswordChange && pathname === "/reset-password"){
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
                
            }
    }

    }


  // user is login and trying to go login page agian
    if(isAuth && isValidAccessToken){

        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole),request.url))
    }
    
    // trying to access common protected route
    if(routeOwner==="COMMON"){
        return NextResponse.next()
    }

    if(routeOwner==="ADMIN"  || routeOwner==="PATIENT" || routeOwner==="DOCTOR"){
        if(routeOwner!==userRole){
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole),request.url))
        }
    }

    

    return NextResponse.next()
}

export const config = {
    matcher : [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ]
}