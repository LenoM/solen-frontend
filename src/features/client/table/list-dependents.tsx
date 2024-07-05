import { Link, useParams } from "react-router-dom";
import { useState } from "react";

import {
  Ban,
  EllipsisVertical,
  ShieldCheck,
  PlusCircle,
  Eye,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/dataTable";
import { formatCPF } from "@/utils/format-utils";
import CancelForm from "@/features/client/forms/cancel";
import ReactivateForm from "@/features/client/forms/reactivate";
import type { CancelType } from "@/features/client/forms/cancel";
import type { ClientType } from "@/features/client/forms/personal";
import type { ReativateType } from "@/features/client/forms/reactivate";
import useClient from "@/hooks/useClient";

const pathNewClient = `${window.origin}/client/add`;

export default function Dependents() {
  const { cancelClient, reactivateClient, getClientByid } = useClient();
  const { clientId: holderId } = useParams();
  const { data: client } = getClientByid(Number(holderId));

  const handlerCancel = async ({
    reason,
    clientId,
    referenceDate,
  }: CancelType) => {
    await cancelClient(
      Number(holderId),
      Number(clientId),
      referenceDate,
      reason
    );
  };

  const handlerReactivate = async ({
    clientId,
    dependents,
    referenceDate,
  }: ReativateType) => {
    await reactivateClient(
      Number(holderId),
      Number(clientId),
      referenceDate,
      dependents
    );
  };

  const columns: ColumnDef<ClientType>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "cpf",
      header: "CPF",
      accessorFn: (cli: ClientType) => formatCPF(cli.cpf),
    },
    {
      accessorKey: "kinship",
      header: "Parentesco",
    },
    {
      accessorKey: "isActive",
      header: "Ativo?",
      accessorFn: (cli: ClientType) => (cli.isActive === true ? "Sim" : "Não"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);
        const [isOpenModalReactivate, setIsOpenModalReactivate] =
          useState(false);
        const newPath = `${window.origin}/client/${row.original.id}`;

        return (
          <div className="flex flex-row-reverse gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir opções</span>
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Cadastro</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={!row.original.isActive}
                    onSelect={() => setIsOpenModalCancel(true)}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    <span>Cancelar</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={!!row.original.isActive}
                    onSelect={() => setIsOpenModalReactivate(true)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Reativar</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to={newPath}>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Vizualizar cadastro</span>
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

            <Dialog
              open={isOpenModalCancel}
              onOpenChange={setIsOpenModalCancel}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Efetuar cancelamento</DialogTitle>
                </DialogHeader>

                <CancelForm
                  onSubmit={handlerCancel}
                  referenceId={Number(row.original.id)}
                />
              </DialogContent>
            </Dialog>

            <Dialog
              open={isOpenModalReactivate}
              onOpenChange={setIsOpenModalReactivate}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Efetuar reativação</DialogTitle>
                </DialogHeader>

                <ReactivateForm
                  onSubmit={handlerReactivate}
                  isHolder={row.original.kinship === "Titular"}
                  referenceId={Number(row.original.id)}
                />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {client?.kinship == "Titular" && (
        <div className="text-right">
          <Button asChild>
            <Link to={pathNewClient}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo
            </Link>
          </Button>
        </div>
      )}

      {client?.dependents && (
        <DataTable columns={columns} data={client.dependents} />
      )}
    </>
  );
}
