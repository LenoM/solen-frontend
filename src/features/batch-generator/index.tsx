import { useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { object, number, date, InferType, string, mixed } from "yup";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dataTable";
import { LoadingSpinner } from "@/components/spinner";

import InvoiceParam from "@/features/batch-generator/form";
import { toDateString } from "@/utils/format-utils";
import useInvoice from "@/hooks/useInvoice";
import { Semaphore } from "@/components/semaphore";

const BatchStatus = {
  Started: "secondary",
  Finish: "primary",
  Cancel: "destructive",
} as const;

const invoiceFilterSchema = object().shape({
  categoryId: number().nullable(),
  productId: number().nullable(),
  clientId: number().nullable(),
  companyId: number().nullable(),
  invoiceId: number().nullable(),
  initialReferenceDate: date().nullable(),
  finalReferenceDate: date().nullable(),
  initialDueDate: date().nullable(),
  finalDueDate: date().nullable(),
});

const batchSchema = object().shape({
  id: number().nullable(),
  creationDate: date().nullable(),
  filter: string().nullable(),
  status: mixed().oneOf(Object.values(BatchStatus)).required(),
});

type BatchType = InferType<typeof batchSchema>;

export type BatchGeneratorType = InferType<typeof invoiceFilterSchema>;

export default function BatchGenerator() {
  const { loading, batchList, getBatchs } = useInvoice();

  useMemo(async () => await getBatchs(), []);

  const columns: ColumnDef<BatchType>[] = [
    {
      accessorKey: "id",
      header: "#ID",
    },
    {
      accessorKey: "filter",
      header: "Filtro",
    },
    {
      accessorKey: "creationDate",
      header: "Data",
      accessorFn: (data: BatchType) =>
        toDateString(data.creationDate ?? undefined),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusItem = row.original.status as keyof typeof BatchStatus;
        return (
          row.original.status && <Semaphore variant={BatchStatus[statusItem]} />
        );
      },
    },
  ];

  return (
    <div className="sx:p-0 md:p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Gerações</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-col md:flex-row place-content-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Parâmetros para geração</DialogTitle>
                </DialogHeader>

                <InvoiceParam />
              </DialogContent>
            </Dialog>
          </div>

          <DataTable columns={columns} data={batchList} />
        </>
      )}
    </div>
  );
}
