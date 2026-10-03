import LoginForm from '@/components/modules/auth/LoginForm'
import React from 'react'

type LoginPageProps={
  searchParams:Promise<{
    redirect?:string
  }>
}


const LoginPage=async({searchParams}:LoginPageProps)=> {

  const params=await searchParams
  const redirectPath=params?.redirect

console.log("redirect path -> ",redirectPath)
  return (
    <div>
      <LoginForm redirectPath={redirectPath}/>
    </div>
  )
}

export default LoginPage