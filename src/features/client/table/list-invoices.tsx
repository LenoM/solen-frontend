import { useParams } from "react-router-dom";
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
import { toast } from "sonner";

import { toDateValue, toMoneyValue } from "@/utils/format-utils";
import { printInvoice, sendInvoice } from "@/services/invoice";

export type Invoice = {
  id: number;
  invoiceNumber: number;
  referenceDate: Date;
  paymentDate: Date;
  dueDate: Date;
  price: number;
};

const handlerSend = async (invoiceNumber: number) => {
  const urlFile = await sendInvoice([invoiceNumber]);

  if (urlFile) {
    toast.info("Envio de boleto", {
      description: `O boleto foi adicionado a fila para envio`,
    });
  } else {
    toast.error("Envio de boleto", {
      description: `O boleto não está disponível`,
    });
  }
};

const handlerPrint = async (invoiceNumber: number) => {
  const urlFile = await printInvoice([invoiceNumber]);

  if (!urlFile) {
    toast.error("Impressão de boleto", {
      description: `O boleto não está disponível`,
    });
  } else {
    toast.info("Impressão de boleto", {
      description: `O boleto está disponível`,
      action: {
        label: "Baixar",
        onClick: () => window.open(urlFile),
      },
    });
  }
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "Número",
  },
  {
    accessorKey: "referenceDate",
    header: "Referência",
    accessorFn: (data: Invoice) => toDateValue(data.referenceDate),
  },
  {
    accessorKey: "dueDate",
    header: "Vencimento",
    accessorFn: (data: Invoice) => toDateValue(data.dueDate),
  },
  {
    accessorKey: "paymentDate",
    header: "Pagamento",
    accessorFn: (data: Invoice) => toDateValue(data.paymentDate),
  },
  {
    accessorKey: "price",
    header: "Valor",
    accessorFn: (data: Invoice) => toMoneyValue(data.price),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = useParams();

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