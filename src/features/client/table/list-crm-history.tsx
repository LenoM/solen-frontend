import { useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, PlusCircle, ForwardIcon, Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/dataTable";
import type { CrmHistoryType } from "@/features/crm/collection-form";
import CrmCollectForm, { loadCrmData } from "@/features/crm/collection-form";
import { CLOSE_STATUS, CrmType } from "@/features/crm/crm-utils";
import { toDateTimeString } from "@/utils/format-utils";
import useClient from "@/hooks/useClient";
import useUser from "@/hooks/useUser";
import useCrm from "@/hooks/useCrm";

export default function CrmHistory() {
  const { clientId } = useParams();

  const { updateCrm, createCrm } = useCrm();
  const { getClientByid } = useClient();
  const { getUserList } = useUser();

  const { data: client } = getClientByid(Number(clientId));
  const { data: user } = getUserList();

  const handlerSubmit = async (newData: CrmHistoryType) => {
    const isUpdate = newData.id! > 0;

    if (isUpdate) {
      await updateCrm(newData);
    } else {
      await createCrm(newData);
    }
  };

  const formatUserName = (userId: string | undefined) => {
    if (!userId || !user) {
      return "";
    }
    return user?.filter((usr) => usr.id === userId)[0].name;
  };

  const columns: ColumnDef<CrmHistoryType>[] = [
    {
      accessorKey: "id",
      header: "Número",
    },
    {
      accessorKey: "creationDate",
      header: "Registro",
      accessorFn: (data: CrmHistoryType) => toDateTimeString(data.creationDate),
    },
    {
      accessorKey: "userId",
      header: "Atendente",
      accessorFn: (data: CrmHistoryType) => formatUserName(data.userId),
    },
    {
      accessorKey: "userIdForward",
      header: "Executor",
      accessorFn: (data: CrmHistoryType) => formatUserName(data.userIdForward),
    },
    {
      accessorKey: "motiveId",
      header: "Motivo",
      accessorFn: (data: CrmHistoryType) => {
        return data.motiveId ? data.motiveId : "Cobrança";
      },
    },
    {
      accessorKey: "subMotiveId",
      header: "Sub Motivo",
      accessorFn: (data: CrmHistoryType) => {
        return data.subMotiveId ? data.subMotiveId : "Inadimplência";
      },
    },
    {
      accessorKey: "returnDate",
      header: "Retorno",
      accessorFn: (data: CrmHistoryType) => toDateTimeString(data.returnDate),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            {row.original.type !== CrmType.Collect && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Encaminhar</span>
                    <ForwardIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}

            {row.original.statusId !== CLOSE_STATUS && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Editar</span>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar atendimento</DialogTitle>
                  </DialogHeader>
                  <CrmCollectForm
                    disabled={false}
                    data={loadCrmData(row.original)}
                    onSubmit={(newData: CrmHistoryType) =>
                      handlerSubmit(newData)
                    }
                  />
                </DialogContent>
              </Dialog>
            )}

            {row.original.statusId === CLOSE_STATUS && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Editar</span>
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Histórico de contato</DialogTitle>
                  </DialogHeader>
                  <CrmCollectForm
                    disabled={true}
                    data={loadCrmData(row.original)}
                    onSubmit={(newData: CrmHistoryType) =>
                      handlerSubmit(newData)
                    }
                  />
                </DialogContent>
              </Dialog>
            )}
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
              <DialogTitle>Editar contato</DialogTitle>
            </DialogHeader>
            <CrmCollectForm
              disabled={false}
              data={loadCrmData()}
              onSubmit={(newData: CrmHistoryType) => handlerSubmit(newData)}
            />
          </DialogContent>
        </Dialog>
      </div>
      {user && client?.crmHistory && (
        <DataTable columns={columns} data={client.crmHistory} />
      )}
    </>
  );
}
