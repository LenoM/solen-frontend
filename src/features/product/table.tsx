import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import type { ProductType } from "@/features/product/form";

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "id",
    header: "#ID",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "supplier.name",
    header: "Fornecedor",
  },
  {
    accessorKey: "billingMethod",
    header: "Cobrança",
    accessorFn: (prod: ProductType) =>
      prod.billingMethod === "Fix" ? "Valor Fixo" : "Faixa Etária",
  },
  {
    accessorKey: "isActive",
    header: "Ativo?",
    accessorFn: (prod: ProductType) => (prod.isActive === true ? "Sim" : "Não"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const newPath = `${window.origin}/product/${row.original.id}`;

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
