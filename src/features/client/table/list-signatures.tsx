import { PlusCircle, Trash } from "lucide-react";
import { useState, useEffect } from "react";
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

import { toDateValue, toMoneyValue } from "@/utils/format-utils";
import HiringForm, { HaringType } from "@/features/client/forms/hiring";
import { createSignature, deleteSignature } from "@/services/signature";
import { toast } from "sonner";

import { DataTable } from "@/components/dataTable";
import { getSignatureByClient } from "@/services/signature";
import SignatureForm, {
  SignatureType,
} from "@/features/client/forms/signature";

export function Signatures() {
  const { clientId } = useParams();
  const [signatures, setSignatures] = useState<SignatureType[]>([]);

  useEffect(() => {
    getData(clientId);
  }, [clientId]);

  const getData = async (clientId: string | undefined) => {
    if (clientId) {
      const result = await getSignatureByClient(Number(clientId));
      setSignatures(result);
    }
  };

  const handlerSubmit = async ({
    productId,
    price,
    initialDate,
    finalDate,
  }: SignatureType) => {
    try {
      const newData = await createSignature(
        Number(clientId),
        productId,
        Number(price),
        initialDate,
        finalDate
      );

      if (!newData.id) {
        toast.error("Erro ao adicionar a assinatura", {
          description: "Ocorreu um erro ao adicionar a assinatura.",
        });

        return;
      }

      setSignatures((prev: SignatureType[]) =>
        prev.filter((d) => d.id !== newData.id).concat(newData)
      );

      toast.success("Assinatura adicionada", {
        description: "A assinatura foi adicionado com sucesso!",
      });
    } catch (error) {
      toast.error("Falha ao adicionar a assinatura", {
        description: "Ocorreu uma falha ao adicionar a assinatura.",
      });
    }
  };

  const handlerDelete = async ({ referenceDate }: HaringType) => {
    try {
      const result = await deleteSignature(Number(clientId), referenceDate);

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
      accessorFn: (data: SignatureType) => toDateValue(data.finalDate ?? null),
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
      <DataTable columns={columns} data={signatures} />
    </>
  );
}
