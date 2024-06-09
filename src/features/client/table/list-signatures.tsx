import { DollarSign, PlusCircle, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DataTable } from "@/components/dataTable";
import HiringForm from "@/features/client/forms/hiring";
import SignatureForm from "@/features/client/forms/signature";
import ProductPrice from "@/features/client/forms/product-price";
import type { HaringType } from "@/features/client/forms/hiring";
import type { SignatureType } from "@/features/client/forms/signature";
import type { ProductPriceType } from "@/features/client/forms/product-price";
import { toDateString, toMoneyString } from "@/utils/format-utils";
import useProductPrice from "@/hooks/useProductPrice";
import useSignature from "@/hooks/useSignature";

export function Signatures() {
  const { clientId } = useParams();
  const { getSignatureByClient, createSignature, deleteSignature } =
    useSignature();
  const { createProductPrice } = useProductPrice();
  const { data: signatures } = getSignatureByClient(Number(clientId));

  const handlerAddPrice = async ({
    productId,
    initialDate,
    finalDate,
    price,
  }: ProductPriceType) => {
    await createProductPrice(
      Number(productId),
      Number(clientId),
      Number(price),
      initialDate,
      finalDate
    );
  };

  const handlerSubmit = async ({
    productId,
    initialDate,
    finalDate,
  }: SignatureType) => {
    await createSignature(Number(clientId), productId, initialDate, finalDate);
  };

  const handlerDelete = async ({ referenceDate, referenceId }: HaringType) => {
    await deleteSignature(Number(referenceId), Number(clientId), referenceDate);
  };

  const columns: ColumnDef<SignatureType>[] = [
    {
      accessorKey: "description",
      header: "Produto",
    },
    {
      accessorKey: "price",
      header: "Preço",
      accessorFn: (data: SignatureType) => toMoneyString(Number(data.price)),
    },
    {
      accessorKey: "finalDate",
      header: "Término",
      accessorFn: (data: SignatureType) =>
        toDateString(data.finalDate?.toString()),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir tabela de preço</span>
                  <DollarSign className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar tabela de preço</DialogTitle>
                </DialogHeader>

                <ProductPrice
                  onSubmit={handlerAddPrice}
                  productId={row.original.productId}
                />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir remoção de assinatura</span>
                  <Trash className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remover Assinatura</DialogTitle>
                </DialogHeader>

                <HiringForm
                  referenceId={Number(row.original.id)}
                  onSubmit={handlerDelete}
                />
              </DialogContent>
            </Dialog>
          </>
        );
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
              <DialogTitle>Adicionar assinatura</DialogTitle>
              <SignatureForm onSubmit={handlerSubmit} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {signatures && <DataTable columns={columns} data={signatures} />}
    </>
  );
}
