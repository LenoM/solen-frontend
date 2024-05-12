import { Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toDateValue, toMoneyValue } from "@/utils/format-utils";
import HiringForm from "@/features/client/forms/hiring";
import { deleteSignature } from "@/services/signature";
import { toast } from "sonner";

const onSubmit = async (id: number, finalDate: Date) => {
  try {
    const result = await deleteSignature(id, finalDate);

    if (result.id) {
      toast.success("Assinatura cancelada", {
        description: "A assinatura foi cancelada com sucesso!",
      });

      return;
    }

    toast.error("Erro ao remover a assinatura", {
      description: "Ocorreu um erro ao cancelar a assinatura.",
    });
  } catch (error) {
    toast.error("Falha ao remover a assinatura", {
      description: "Ocorreu uma falha ao cancelar a assinatura.",
    });
  }
};

export type Signature = {
  id: number;
  price: number;
  finalDate: Date;
};

export const columns: ColumnDef<Signature>[] = [
  {
    accessorKey: "description",
    header: "Produto",
  },
  {
    accessorKey: "price",
    header: "Preço",
    accessorFn: (data: Signature) => toMoneyValue(Number(data.price)),
  },
  {
    accessorKey: "finalDate",
    header: "Término",
    accessorFn: (data: Signature) => toDateValue(data.finalDate),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Trash className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover Assinatura</DialogTitle>
            </DialogHeader>

            <HiringForm referenceId={row.original.id} onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
