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

import HiringForm from "@/features/client/forms/hiring";
import type { HaringType } from "@/features/client/forms/hiring";
import DiscountForm from "@/features/client/forms/discount";
import type { DiscountType } from "@/features/client/forms/discount";
import { toDateString, toMoneyValue } from "@/utils/format-utils";
import useDiscount from "@/hooks/useDiscount";
import { Dispatch, SetStateAction } from "react";

type DiscountProps = {
  data: DiscountType[];
  setDiscountList?: Dispatch<SetStateAction<DiscountType[]>>;
};

export function Discounts({ data, setDiscountList }: DiscountProps) {
  const { clientId } = useParams();
  const { createDiscount, deleteDiscount } = useDiscount();

  const handlerSubmit = async ({
    productId,
    price,
    description,
    initialDate,
    finalDate,
  }: DiscountType) => {
    const newData = await createDiscount(
      Number(clientId),
      productId,
      Number(price),
      description,
      initialDate,
      finalDate
    );

    setDiscountList && setDiscountList(newData);
  };

  const handlerDelete = async ({ referenceDate, referenceId }: HaringType) => {
    await deleteDiscount(Number(referenceId), referenceDate);
    setDiscountList &&
      setDiscountList((prev: DiscountType[]) =>
        prev.filter((d) => d.id !== referenceId)
      );
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
      <DataTable columns={columns} data={data} />
    </>
  );
}
