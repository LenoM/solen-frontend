import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { UserType } from "@/features/user/form";

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: "Ativo?",
    accessorFn: (usr: UserType) => (usr.isActive === true ? "Sim" : "Não"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const newPath = `${window.origin}/user/${row.original.id}`;

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
