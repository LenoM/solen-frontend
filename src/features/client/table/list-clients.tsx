import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

type Client = {
  id: string;
  cpf: string;
  name: string;
  kinship: string;
  isActive: boolean;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "isActive",
    header: "Ativo?",
    accessorFn: (status: Client) => (status.isActive === true ? "Sim" : "Não"),
  },
  {
    accessorKey: "kinship",
    header: "Parentesco",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const newPath = `${window.origin}/client/${row.original.id}`;

      return (
        <Link to={newPath}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
];
