import AdminDashboardContent from '@/components/modules/dashboard/AdminDashboardContent'
import { getDashboardData } from '@/services/dashboard.service'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

export default async function AdminDashboardPage() {

  const queryClient=new QueryClient()

  await queryClient.prefetchQuery({
    queryKey:["admin-dashbaord-data"],
    queryFn:getDashboardData,
    staleTime:30*1000,
    gcTime:5*60*1000
  })

  const data=queryClient.getQueryData(["admin-dashbaord-data"])
  console.log("dashboard data",data)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent/>
    </HydrationBoundary>
  )
}
