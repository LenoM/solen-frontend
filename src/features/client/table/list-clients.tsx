import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { formatCPF } from "@/utils/format-utils";

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
    accessorFn: (cli: Client) => formatCPF(cli.cpf),
  },
  {
    accessorKey: "kinship",
    header: "Parentesco",
  },
  {
    accessorKey: "isActive",
    header: "Ativo?",
    accessorFn: (cli: Client) => (cli.isActive === true ? "Sim" : "Não"),
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
