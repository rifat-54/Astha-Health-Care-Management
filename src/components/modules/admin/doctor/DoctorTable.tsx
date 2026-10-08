
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getDoctors } from "@/services/doctor.service";

import { useQuery } from "@tanstack/react-query";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

type Doctor = {
  name: string;
  experience: number;
};

const features = tableFeatures({});

export const DoctorsTable = () => {
  const doctorColumns: Array<ColumnDef<typeof features, Doctor>> = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue<string>(),
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: (info) => info.getValue<number>(),
    },
  ];

  const { data: doctorDataResponse } = useQuery({
      queryKey: ["doctors"],
      queryFn: getDoctors,
  });

  console.log("doctor management ->",doctorDataResponse)

  const doctors = doctorDataResponse?.data ?? [];

  const table = useTable({
    key: "doctors-table",
    features,
    columns: doctorColumns,
    data: doctors,
  });

  // console.log(doctors);

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id}>
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

