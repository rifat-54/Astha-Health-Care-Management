export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export const authRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email" ];

export const isAuthRoute=(pathName:string)=>{
    return authRoutes.some((route)=>route===pathName)
}

export type RouteConfig={
    exact:string[],
    pattern:RegExp[]
}

export const commonProtectedRoutes:RouteConfig={
    exact:["/my-profile","/change-password"],
    pattern:[]
}

export const patientProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard/ ], // Matches any path that starts with /dashboard
    exact : [ "/payment/success"]
};

export const doctorProtectedRoutes : RouteConfig = {
    pattern: [/^\/doctor\/dashboard/ ], // Matches any path that starts with /doctor/dashboard
    exact : []
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin\/dashboard/ ], // Matches any path that starts with /admin/dashboard
    exact : []
}


export const isRouteMatches=(pathname:string,route:RouteConfig)=>{
    if(route.exact.includes(pathname)){
        return true
    }

    return route.pattern.some((pattern:RegExp)=>pattern.test(pathname))
}


export const getRouteOwner = (pathname : string) : "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
   if(isRouteMatches(pathname,doctorProtectedRoutes)){
    return "DOCTOR"
   }


    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    if(isRouteMatches(pathname, patientProtectedRoutes)) {
        return "PATIENT";
    }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}



export const getDefaultDashboardRoute=(role:UserRole)=>{

    if(role==="ADMIN" || role==="SUPER_ADMIN"){
        return "/admin/dashboard"
    }

    if(role === "DOCTOR") {
        return "/doctor/dashboard";
    }

    if(role === "PATIENT") {
        return "/dashboard";
    }

    return "/";
}
 

export const isValidRedirectForRole=(redirectPath:string,role:UserRole)=>{
    const unifySuperAdminAndAdminRole=role==="SUPER_ADMIN"?"ADMIN":role
    
    role=unifySuperAdminAndAdminRole

    const routeOwner=getRouteOwner(redirectPath)

    if(routeOwner===null || routeOwner==="COMMON"){
        return true;
    }

    if(routeOwner===role){
        return true
    }
    return false
}