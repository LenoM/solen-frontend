import { Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

type AddressType = {
  abbreviation: string;
};
type District = {
  abbreviation: string;
  city: City;
};

type State = {
  abbreviation: string;
};

type City = {
  abbreviation: string;
  state: State;
};

type Address = {
  id: number;
  address: string;
  addressType: AddressType;
  district: District;
  city: City;
  state: State;
  cep: string;
  number: number | null;
  complement: string;
};

const formatAddress = (data: Address) => {
  return (
    data.addressType.abbreviation +
    `. ${data.address}` +
    (data.number ? `, ${data.number}` : "") +
    (data.complement ? `, ${data.complement}` : "")
  );
};

export const columns: ColumnDef<Address>[] = [
  {
    accessorKey: "address",
    header: "Endereço",
    accessorFn: (data: Address) => formatAddress(data).toUpperCase(),
  },
  {
    accessorKey: "district",
    header: "Bairro",
    accessorFn: (data: Address) => data.district.abbreviation.toUpperCase(),
  },
  {
    accessorKey: "city",
    header: "Cidade",
    accessorFn: (data: Address) => data.district.city.abbreviation.toUpperCase(),
  },
  {
    accessorKey: "state",
    header: "UF",
    accessorFn: (data: Address) => data.district.city.state.abbreviation,
  },
  {
    accessorKey: "cep",
    header: "CEP",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <>
          <Link to={`${row.original.id}`}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>

          <Link to={`${row.original.id}`}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Trash className="h-4 w-4" />
            </Button>
          </Link>
        </>
      );
    },
  },
];
