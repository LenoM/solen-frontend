import { useState } from "react";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";

import {
  PlusCircle,
  Send,
  Printer,
  Search,
  EllipsisVertical,
  File,
  CircleX,
  GitMerge,
  GitFork,
  CirclePlus,
  CircleMinus,
  FileX,
  Eye,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTable } from "@/components/dataTable";
import InvoiceFilter from "@/features/invoice/forms/filter";
import type { InvoiceType } from "@/features/invoice/forms/invoice";
import { toDateString, toMoneyString } from "@/utils/format-utils";
import { queryClient } from "@/lib/react-query";
import useInvoice from "@/hooks/useInvoice";

const BATCH_PATH = `${window.origin}/batch`;
const DETAIL_PATH = `${window.origin}/invoice`;
const NEW_PATH = `${DETAIL_PATH}/detail`;

export default function Invoices() {
  const { sendInvoice, printInvoice, getInvoices } = useInvoice();

  getInvoices({});
  const data = queryClient.getQueryData<InvoiceType[]>(["getInvoices"]) ?? [];

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
            <Link to={`${DETAIL_PATH}/${row.original.id}`}>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Vizualizar cadastro</span>
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

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
    <div className="sx:p-0 md:p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Boletos</h1>

      <div className="flex flex-col md:flex-row place-content-end gap-2">
        <Button asChild>
          <Link to={NEW_PATH}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to={BATCH_PATH}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ver lotes
          </Link>
        </Button>


        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Parâmetros de busca</DialogTitle>
            </DialogHeader>

            <InvoiceFilter />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
