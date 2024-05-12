import { toast } from "sonner";
import { Info, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { toDateValue, toMoneyValue } from "@/utils/format-utils";
import HiringForm from "@/features/client/forms/hiring";
import { deleteDiscount } from "@/services/discount";

const onSubmit = async (id: number, finalDate: Date) => {
  try {
    const result = await deleteDiscount(id, finalDate);

    if (result.id) {
      toast.success("Desconto cancelado", {
        description: "O desconto foi cancelado com sucesso!",
      });

      return;
    }

    toast.error("Erro ao remover o desconto", {
      description: "Ocorreu um erro ao cancelar o desconto.",
    });
  } catch (error) {
    toast.error("Falha ao remover o desconto", {
      description: "Ocorreu uma falha ao cancelar o desconto.",
    });
  }
};

export type Discount = {
  id: number;
  price: number;
  finalDate: Date;
  clientId: number;
};

export const columns: ColumnDef<Discount>[] = [
  {
    accessorKey: "product.description",
    header: "Pruduto",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "price",
    header: "Preço",
    accessorFn: (data: Discount) => toMoneyValue(Number(data.price)),
  },
  {
    accessorKey: "finalDate",
    header: "Término",
    accessorFn: (data: Discount) => toDateValue(data.finalDate),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      if (row.original.clientId) {
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
                <DialogTitle>Remover Desconto</DialogTitle>
              </DialogHeader>

              <HiringForm referenceId={row.original.id} onSubmit={onSubmit} />
            </DialogContent>
          </Dialog>
        );
      } else {
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Info className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>

            <HoverCardContent className="w-50">
              <div className="flex">
                <div className="space-y-1 max-w-48">
                  <h4 className="text-sm text-left font-semibold">Desconto compartilhado</h4>

                  <p>
                    Não é possível deletar esse desconto aqui, pois ele não é exclusivo deste cliente.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      }
    },
  },
];
