import { Send, Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { InvoiceType } from "@/features/invoice/forms/invoice";
import { toDateString, toMoneyString } from "@/utils/format-utils";
import { DataTable } from "@/components/dataTable";
import useInvoice from "@/hooks/useInvoice";
import useClient from "@/hooks/useClient";

export function Invoices() {
  const { clientId } = useParams();
  const { getClientByid } = useClient();
  const { data: client } = getClientByid(Number(clientId));
  const { sendInvoice, printInvoice } = useInvoice();

  const handlerSend = async (invoiceNumber: number) => {
    await sendInvoice([invoiceNumber]);
  };

  const handlerPrint = async (invoiceNumber: number) => {
    await printInvoice([invoiceNumber]);
  };

  const columns: ColumnDef<InvoiceType>[] = [
    {
      accessorKey: "id",
      header: "Número",
    },
    {
      accessorKey: "referenceDate",
      header: "Referência",
      accessorFn: (data: InvoiceType) => toDateString(data.referenceDate),
    },
    {
      accessorKey: "dueDate",
      header: "Vencimento",
      accessorFn: (data: InvoiceType) => toDateString(data.dueDate),
    },
    {
      accessorKey: "paymentDate",
      header: "Pagamento",
      accessorFn: (data: InvoiceType) => toDateString(data.paymentDate),
    },
    {
      accessorKey: "price",
      header: "Valor",
      accessorFn: (data: InvoiceType) => toMoneyString(data.price),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Printer className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Impressão de boleto</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja imprimir o boleto?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mb-2">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => handlerPrint(Number(row.original.id))}
                      type="submit"
                      variant="destructive"
                      className="mb-2"
                    >
                      Imprimir
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Send className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Envio de boleto</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja enviar o boleto para o e-mail
                    cadastrado?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mb-2">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => handlerSend(Number(row.original.id))}
                      type="submit"
                      variant="destructive"
                      className="mb-2"
                    >
                      Enviar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      },
    },
  ];

  return (
    <>
      {client?.invoices && (
        <DataTable columns={columns} data={client.invoices} />
      )}
    </>
  );
}
