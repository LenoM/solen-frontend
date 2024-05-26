import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Info, PlusCircle, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dataTable";
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

import HiringForm, { HaringType } from "@/features/client/forms/hiring";
import DiscountForm, { DiscountType } from "@/features/client/forms/discount";
import { toDateString, toMoneyValue } from "@/utils/format-utils";
import {
  createDiscount,
  deleteDiscount,
  getDiscountsByClient,
} from "@/services/discount";

export function Discounts() {
  const { clientId } = useParams();
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);

  useEffect(() => {
    getData(clientId);
  }, [clientId]);

  const getData = async (clientId: string | undefined) => {
    if (clientId) {
      const result = await getDiscountsByClient(Number(clientId));
      setDiscounts(result);
    }
  };

  const handlerSubmit = async ({
    productId,
    price,
    description,
    initialDate,
    finalDate,
  }: DiscountType) => {
    try {
      const newData = await createDiscount(
        Number(clientId),
        productId,
        Number(price),
        description,
        initialDate,
        finalDate
      );

      if (newData.length > 0) {
        setDiscounts(newData);

        toast.success("Desconto adicionado", {
          description: "O desconto foi adicionado com sucesso!",
        });

        return;
      }

      toast.error("Erro ao adicionar o desconto", {
        description: "Ocorreu um erro ao adicionar o desconto.",
      });
    } catch (error) {
      toast.error("Falha ao adicionar o desconto", {
        description: "Ocorreu uma falha ao adicionar o desconto.",
      });
    }
  };

  const handlerDelete = async ({ referenceDate, referenceId }: HaringType) => {
    try {
      const result = await deleteDiscount(Number(referenceId), referenceDate);

      if (result.length > 0) {
        setDiscounts(result);

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

  const columns: ColumnDef<DiscountType>[] = [
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
      accessorFn: (data: DiscountType) => toMoneyValue(Number(data.price)),
    },
    {
      accessorKey: "finalDate",
      header: "Término",
      accessorFn: (data: DiscountType) =>
        toDateString(data?.finalDate?.toString()),
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

                <HiringForm
                  referenceId={Number(row.original.id)}
                  onSubmit={handlerDelete}
                />
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
                    <h4 className="text-sm text-left font-semibold">
                      Desconto compartilhado
                    </h4>

                    <p>
                      Não é possível deletar esse desconto por aqui, pois ele
                      não é exclusivo deste cliente.
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

  return (
    <>
      <div className="text-right">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar descontos</DialogTitle>
            </DialogHeader>
            <DiscountForm onSubmit={handlerSubmit} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={discounts} />
    </>
  );
}
