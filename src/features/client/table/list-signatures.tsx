import { PlusCircle, Trash } from "lucide-react";
import { useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SignatureForm from "@/features/client/forms/signature";
import type { SignatureType } from "@/features/client/forms/signature";
import HiringForm from "@/features/client/forms/hiring";
import type { HaringType } from "@/features/client/forms/hiring";
import { toDateString, toMoneyValue } from "@/utils/format-utils";
import { DataTable } from "@/components/dataTable";
import useSignature from "@/hooks/useSignature";
import { Dispatch, SetStateAction } from "react";

type SignatureProps = {
  data: SignatureType[];
  setSignatureList?: Dispatch<SetStateAction<SignatureType[]>>;
};

export function Signatures({ data, setSignatureList }: SignatureProps) {
  const { clientId } = useParams();
  const { createSignature, deleteSignature } = useSignature();

  const handlerSubmit = async ({
    productId,
    initialDate,
    finalDate,
  }: SignatureType) => {
    const newData = await createSignature(
      Number(clientId),
      productId,
      initialDate,
      finalDate
    );
    setSignatureList && setSignatureList(newData);
  };

  const handlerDelete = async ({ referenceDate, referenceId }: HaringType) => {
    await deleteSignature(Number(referenceId), referenceDate);
    setSignatureList &&
      setSignatureList((prev: SignatureType[]) =>
        prev.filter((d) => d.id !== referenceId)
      );
  };

  const columns: ColumnDef<SignatureType>[] = [
    {
      accessorKey: "description",
      header: "Produto",
    },
    {
      accessorKey: "price",
      header: "Preço",
      accessorFn: (data: SignatureType) => toMoneyValue(Number(data.price)),
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

              <HiringForm
                referenceId={Number(row.original.id)}
                onSubmit={handlerDelete}
              />
            </DialogContent>
          </Dialog>
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
      <DataTable columns={columns} data={data} />
    </>
  );
}
