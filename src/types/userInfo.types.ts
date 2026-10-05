import { UserRole } from "@/lib/authUtils";

export interface IUserInfo{
    id:string,
    name:string,
    email:string,
    role:UserRole
}