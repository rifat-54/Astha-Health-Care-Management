import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  noop,
} from "@tanstack/react-query";
import React from "react";
import { getDoctors } from "./_actions";
import DoctorList from "@/src/components/modules/consultation/DoctorList";

const ConsultationPage = async () => {
  const queryClient = new QueryClient();

  // await queryClient.query({
  //   queryKey:["doctors"],
  //   queryFn:getDoctors
  // })

  // await queryClient
  // .query({
  //   queryKey: ['doctors'],
  //   queryFn: getDoctors,
  // })
  // .catch(noop)

  try {
    await queryClient.query({
      queryKey: ["doctors"],
      queryFn: getDoctors,
    });
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorList />
    </HydrationBoundary>
  );
};

export default ConsultationPage;

// import React from 'react'

// export default function ConsultationPage() {
//   return (
//     <div>ConsultationPage</div>
//   )
// }
