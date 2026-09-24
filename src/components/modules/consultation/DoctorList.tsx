"use client"
import { getDoctors } from '@/src/app/(commonLayout)/consultation/_actions';
import { useQuery } from '@tanstack/react-query';


function DoctorList() {
      const { data  } = useQuery({
       queryKey: ["doctors"],
       queryFn: () => getDoctors(),
     });

     console.log(data);


  return (
    <div>DoctorList</div>
  )
}

export default DoctorList