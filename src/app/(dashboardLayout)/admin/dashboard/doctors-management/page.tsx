
import DoctorTable from "@/components/modules/admin/doctor/DoctorTable";
import { getDoctors } from "@/services/doctor.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const DoctorsManagementPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 1 hour
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorTable />
    </HydrationBoundary>
  );
}

export default DoctorsManagementPage