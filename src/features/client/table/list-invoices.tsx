import { Send, Printer } from "lucide-react";
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

import { toDateString, toMoneyValue } from "@/utils/format-utils";
import { DataTable } from "@/components/dataTable";
import useInvoice from "@/hooks/useInvoice";

//TODO reutilizar tipo de boleto do yup - ainda nao implementado
export type Invoice = {
  id: number;
  invoiceNumber: number;
  referenceDate: Date;
  paymentDate: Date;
  dueDate: Date;
  price: number;
};

export function Invoices(data: any) {
  const { sendInvoice, printInvoice } = useInvoice();

  const handlerSend = async (invoiceNumber: number) => {
    await sendInvoice([invoiceNumber]);
  };

  const handlerPrint = async (invoiceNumber: number) => {
    await printInvoice([invoiceNumber]);
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "id",
      header: "Número",
    },
    {
      accessorKey: "referenceDate",
      header: "Referência",
      accessorFn: (data: Invoice) => toDateString(data.referenceDate),
    },
    {
      accessorKey: "dueDate",
      header: "Vencimento",
      accessorFn: (data: Invoice) => toDateString(data.dueDate),
    },
    {
      accessorKey: "paymentDate",
      header: "Pagamento",
      accessorFn: (data: Invoice) => toDateString(data.paymentDate),
    },
    {
      accessorKey: "price",
      header: "Valor",
      accessorFn: (data: Invoice) => toMoneyValue(data.price),
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

  return <DataTable columns={columns} data={data?.invoice} />;
}
