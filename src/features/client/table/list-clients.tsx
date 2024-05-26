import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Ban,
  EllipsisVertical,
  ShieldCheck,
  Eye,
  PlusCircle,
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

import { cancelClient, reactivateClient } from "@/services/client";
import { DataTable } from "@/components/dataTable";
import { formatCPF } from "@/utils/format-utils";
import CancelForm, { CancelType } from "@/features/client/forms/cancel";
import ReactivateForm, {
  ReativateType,
} from "@/features/client/forms/reactivate";
import { ClientType } from "@/features/client/forms/personal";

type ClientTableProps = {
  showAddBtn: boolean;
  clients: ClientType[];
};

const pathNewClient = `${window.origin}/client/add`;

export function Clients({ clients, showAddBtn }: ClientTableProps) {
  const [data, setData] = useState(clients);

  useEffect(() => {
    setData(clients);
  }, [clients]);

  const handlerCancel = async ({
    reason,
    clientId,
    referenceDate,
  }: CancelType) => {
    const result = await cancelClient(Number(clientId), referenceDate, reason);

    if (!result.error) {
      const clientIndex = clients.findIndex(
        (cli) => Number(cli.id) === clientId
      );
      const newClient = { ...clients[clientIndex], isActive: false };

      const newClients = [
        ...clients.slice(0, clientIndex),
        newClient,
        ...clients.slice(clientIndex + 1),
      ];
      setData(newClients);

      toast.info("Cancelamento realizado", {
        description: `O cliente #${clientId} foi cancelado`,
      });
    } else {
      toast.error("Erro no cancelamento", {
        description: "Ocorreu um erro ao tentar cancelar o cliente",
      });
    }
  };

  const handlerReactivate = async ({
    clientId,
    dependents,
    referenceDate,
  }: ReativateType) => {
    const result = await reactivateClient(
      Number(clientId),
      referenceDate,
      dependents
    );

    if (!result.error) {
      const clientIndex = clients.findIndex(
        (cli) => Number(cli.id) === clientId
      );
      const newClient = { ...clients[clientIndex], isActive: true };

      const newClients = [
        ...clients.slice(0, clientIndex),
        newClient,
        ...clients.slice(clientIndex + 1),
      ];
      setData(newClients);

      toast.info("Reativação realizada", {
        description: `O cliente #${clientId} foi reativado`,
      });
    } else {
      toast.error("Erro na reativação", {
        description: "Ocorreu um erro ao tentar reativar o cliente",
      });
    }
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
      <div className="text-right">
        {showAddBtn && (
          <Link to={pathNewClient}>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </Link>
        )}
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
}
