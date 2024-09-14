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
import { Semaphore } from "@/components/semaphore";

import CrmCollectForm, {
  loadCollectionData,
} from "@/features/crm/collection-form";
import type { CollectHistoryType } from "@/features/crm/collection-form";
import type { CrmHistoryType } from "@/features/crm/crm-form";
import CrmForm, { loadCrmData } from "@/features/crm/crm-form";

import {
  CLOSE_STATUS,
  CrmType,
  crmMotive,
  crmSubMotive,
} from "@/features/crm/crm-utils";

import { formatUserName, toDateTimeString } from "@/utils/format-utils";
import useClient from "@/hooks/useClient";
import useUser from "@/hooks/useUser";
import useCrm from "@/hooks/useCrm";

const CrmStatus = {
  1: "primary",
  2: "secondary",
  3: "destructive",
} as const;

const formatMotive = (id: string) => {
  if (!id) return "Cobrança";
  return crmMotive?.filter((mot) => mot.id === Number(id))[0].name;
};

const formatSubMotive = (id: string) => {
  if (!id) return "Inadimplência";
  return crmSubMotive?.filter((mot) => mot.id === Number(id))[0].name;
};

const formatDescription = (desc: string) => {
  if (!desc) return "";
  if (desc.length < 12) return desc;

  return `${desc.substring(0, 12)}...`;
};

export default function CrmHistory() {
  const { clientId } = useParams();

  const { updateCollect, createCrm } = useCrm();
  const { getClientByid } = useClient();
  const { getUserList } = useUser();

  const { data: client } = getClientByid(Number(clientId));
  const { data: user } = getUserList();

  const handlerCollectSubmit = async (newData: CollectHistoryType) => {
    newData.clientId = Number(clientId) || 0;
    newData.statusId = CLOSE_STATUS;
    await updateCollect(newData);
  };

  const handlerCrmSubmit = async (newData: CrmHistoryType) => {
    newData.clientId = Number(clientId) || 0;
    newData.collectStatusId = undefined;
    const isUpdate = newData.id! > 0;

    if (isUpdate) {
      await updateCollect(newData);
    } else {
      await createCrm(newData);
    }
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
      accessorKey: "motiveId",
      header: "Motivo",
      accessorFn: (data: CrmHistoryType) => formatMotive(data.motiveId),
    },
    {
      accessorKey: "subMotiveId",
      header: "Sub Motivo",
      accessorFn: (data: CrmHistoryType) => formatSubMotive(data.subMotiveId),
    },
    {
      accessorKey: "userId",
      header: "Atendente",
      accessorFn: (data: CrmHistoryType) => formatUserName(data.userId, user),
    },
    {
      accessorKey: "userIdForward",
      header: "Executor",
      accessorFn: (data: CrmHistoryType) =>
        formatUserName(data.userIdForward ?? data.userId, user),
    },
    {
      accessorKey: "returnDate",
      header: "Retorno",
      accessorFn: (data: CrmHistoryType) => toDateTimeString(data.returnDate),
    },
    {
      accessorKey: "description",
      header: "Descricao",
      accessorFn: (data: CrmHistoryType) => formatDescription(data.description),
    },
    {
      accessorKey: "statusId",
      header: "Status",
      cell: ({ row }) => {
        const statusItem = Number(
          row.original.statusId
        ) as keyof typeof CrmStatus;
        return statusItem && <Semaphore variant={CrmStatus[statusItem]} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            {row.original.type === CrmType.Collect &&
              Number(row.original.statusId) !== CLOSE_STATUS && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Editar</span>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar atendimento</DialogTitle>
                    </DialogHeader>
                    <CrmCollectForm
                      disabled={false}
                      data={loadCollectionData(row.original)}
                      onSubmit={(newData: CollectHistoryType) =>
                        handlerCollectSubmit(newData)
                      }
                    />
                  </DialogContent>
                </Dialog>
              )}

            {row.original.type === CrmType.Collect &&
              Number(row.original.statusId) === CLOSE_STATUS && (
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
                      data={loadCollectionData(row.original)}
                      onSubmit={(newData: CollectHistoryType) =>
                        handlerCollectSubmit(newData)
                      }
                    />
                  </DialogContent>
                </Dialog>
              )}

            {row.original.type !== CrmType.Collect &&
              Number(row.original.statusId) !== CLOSE_STATUS && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Encaminhar</span>
                      <ForwardIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}

            {row.original.type !== CrmType.Collect &&
              Number(row.original.statusId) === CLOSE_STATUS && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Editar</span>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Histórico de atendimento</DialogTitle>
                    </DialogHeader>
                    <CrmForm
                      disabled={true}
                      data={loadCrmData(row.original)}
                      onSubmit={(newData: CrmHistoryType) =>
                        handlerCrmSubmit(newData)
                      }
                    />
                  </DialogContent>
                </Dialog>
              )}

            {row.original.type !== CrmType.Collect &&
              Number(row.original.statusId) !== CLOSE_STATUS && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Editar</span>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar histórico de atendimento</DialogTitle>
                    </DialogHeader>
                    <CrmForm
                      disabled={false}
                      data={loadCrmData(row.original)}
                      onSubmit={(newData: CrmHistoryType) =>
                        handlerCrmSubmit(newData)
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
              <DialogTitle>Registrar atendimento</DialogTitle>
            </DialogHeader>
            <CrmForm
              disabled={false}
              data={loadCrmData()}
              onSubmit={(newData: CrmHistoryType) => handlerCrmSubmit(newData)}
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
