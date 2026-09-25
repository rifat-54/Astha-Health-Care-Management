"use client"
import { getDoctors } from '@/src/app/(commonLayout)/consultation/_actions';
import { useQuery } from '@tanstack/react-query';


function DoctorList() {
      const { data  } = useQuery({
       queryKey: ["doctors"],
       queryFn: () => getDoctors(),
     });

     console.log(data);

     //non-prefetched query example
    //  const {data : nonPrefetchedData} = useQuery({
    //    queryKey: ["doctors-non-prefetched"],
    //    queryFn: () => getDoctors(),
    //  });

    //  console.log(nonPrefetchedData);


  return (
    <div>DoctorList

    {data ?.data?.map((doctor:any)=>(
      <div key={doctor.id}>
        {doctor.name}
      </div>
    ))}

    </div>
  )
}

export default DoctorList