import { NextRequest } from 'next/server'
import React from 'react'

export default function DoctorDashboardPage(req:NextRequest) {
  console.log("Req form doctor dashboard",req.url)
  return (
    <div>DoctorDashboardPage</div>
  )
}
