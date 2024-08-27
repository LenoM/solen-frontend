import { Trash, PlusCircle, Download } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "react-router-dom";

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

import { DataTable } from "@/components/dataTable";
import { Button } from "@/components/ui/button";

import DocumentForm, {
  loadDocumentData,
} from "@/features/client/forms/document";
import type { DocumentDataType } from "@/features/client/forms/document";

import { formatUserName, toDateTimeString } from "@/utils/format-utils";
import useDocument from "@/hooks/useDocument";
import useUser from "@/hooks/useUser";

export default function Documents() {
  const { clientId } = useParams();

  const { getUserList } = useUser();
  const { data: user } = getUserList();

  const { getDocumentByClient, createDocument } = useDocument();
  const { data: documents } = getDocumentByClient(Number(clientId));

  const handlerSubmit = async (newData: DocumentDataType) => {
    newData.clientId = Number(clientId);
    await createDocument(newData);
  };


  const columns: ColumnDef<DocumentDataType>[] = [
    {
      accessorKey: "creationDate",
      header: "Registro",
      accessorFn: (data: DocumentDataType) =>
        toDateTimeString(data.creationDate),
    },
    {
      accessorKey: "docTypeId",
      header: "Tipo",
      accessorFn: (data: DocumentDataType) => data.documentType?.description,
    },
    {
      accessorKey: "creatorUserId",
      header: "Usuário",
      accessorFn: (data: DocumentDataType) =>
        formatUserName(data.creatorUserId, user),
    },
    {
      accessorKey: "docName",
      header: "Nome",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <Button
              onClick={() =>
              }
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Download</span>
              <Download className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Delete document</span>
                  <Trash className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Remover documento</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja remover o documento?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mb-2">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() =>
                    type="submit"
                    variant="destructive"
                    className="mb-2"
                  >
                    Remover
                  </Button>
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
              <DialogTitle>Adicionar documentos</DialogTitle>
            </DialogHeader>
            <DocumentForm
              data={loadDocumentData()}
              onSubmit={(newData: DocumentDataType) => handlerSubmit(newData)}
            />
          </DialogContent>
        </Dialog>
      </div>
      {documents && <DataTable columns={columns} data={documents} />}
    </>
  );
}
