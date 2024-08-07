import { Eye, PlusCircle, Printer, Trash, FileSpreadsheet } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

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

import { LoadingSpinner } from "@/components/spinner";
import { DataTable } from "@/components/dataTable";

import type { ReportType } from "@/features/custom-report/form";
import ReportForm from "@/features/custom-report/form";

import { toDateString } from "@/utils/format-utils";
import useReport from "@/hooks/useReport";

export default function Report() {
  const { getReportList, printReport, exportReport, deleteReport } =
    useReport();
  const { data, isLoading } = getReportList();

  const handlerPrint = async (reportNumber: number) => {
    await printReport(reportNumber);
  };

  const handlerExport = async (reportNumber: number) => {
    await exportReport(reportNumber);
  };

  const handlerDelete = async (reportId: number) => {
    await deleteReport(reportId);
  };

  const columns: ColumnDef<ReportType>[] = [
    {
      accessorKey: "id",
      header: "#ID",
    },
    {
      accessorKey: "creationDate",
      header: "Criado em",
      accessorFn: (data: ReportType) => toDateString(data.creationDate),
    },
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const newPath = `${window.origin}/report/${row.original.id}`;

        return (
          <>
            <Button variant="ghost" className="h-8 w-8 p-0" asChild>
              <Link to={newPath}>
                <span className="sr-only">Open menu</span>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Trash className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Remover relatório</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja remover o relatório?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mb-2">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() => handlerDelete(Number(row.original.id))}
                    type="submit"
                    variant="destructive"
                    className="mb-2"
                  >
                    Remover
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Imprimir relatório</span>
                  <Printer className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Impressão de relatório</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja imprimir o relatório?
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
                      variant="default"
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
                  <span className="sr-only">Exportar relatório</span>
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Exportação de relatório</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja exportar o relatório?
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
                      onClick={() => handlerExport(Number(row.original.id))}
                      type="submit"
                      variant="default"
                      className="mb-2"
                    >
                      Exportar
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
      <h1 className="text-3xl font-bold text-center">Relatórios</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex place-content-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar relatório</DialogTitle>
                </DialogHeader>

                <ReportForm />
              </DialogContent>
            </Dialog>
          </div>

          <DataTable columns={columns} data={data ?? []} />
        </>
      )}
    </div>
  );
}
