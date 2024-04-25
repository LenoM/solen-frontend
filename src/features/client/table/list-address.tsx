import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
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

import { deleteAddress } from "@/services/address";
import AddressForm, { AddressDataProps } from "@/features/client/forms/address";

type AddressType = {
  id: string;
  abbreviation: string;
};
type District = {
  id: string;
  city: City;
  abbreviation: string;
};

type State = {
  id: string;
  abbreviation: string;
};

type City = {
  id: string;
  abbreviation: string;
  state: State;
};

export type Address = {
  id: number;
  address: string;
  addressType: AddressType;
  addressCategory: string;
  district: District;
  city: City;
  state: State;
  cep: string;
  number: number | null;
  complement: string;
};

const formatAddress = (data: Address) => {
  return (
    data.addressType.abbreviation +
    `. ${data.address}` +
    (data.number ? `, ${data.number}` : "") +
    (data.complement ? `, ${data.complement}` : "")
  );
};

const editAddress = (data: Address): AddressDataProps => {
  return {
    cep: data.cep,
    city: data.district.city.id,
    state: data.district.city.state.id,
    district: data.district.id,
    address: data.address,
    number: data.number,
    complement: data.complement,
    addressType: data.addressType.id,
    addressCategory: data.addressCategory,
  };
};

const handlerDelete = async (clientId: number, addressId: number) => {
  try {
    const result = await deleteAddress(clientId, addressId);

    if (result.id) {
      toast.success("Endereço cadastrado", {
        description: `O endereço #${addressId} foi removido com sucesso!`,
      });

      return;
    }

    toast.error("Erro ao remover o Endereço", {
      description: `Ocorreu um erro ao remover o endereço #${addressId}.`,
    });
  } catch (error) {
    toast.error("Falha ao remover o Endereço", {
      description: `Ocorreu uma falha ao remover o endereço.`,
    });
  }
};

export const columns: ColumnDef<Address>[] = [
  {
    accessorKey: "address",
    header: "Endereço",
    accessorFn: (data: Address) => formatAddress(data).toUpperCase(),
  },
  {
    accessorKey: "district",
    header: "Bairro",
    accessorFn: (data: Address) => data.district.abbreviation.toUpperCase(),
  },
  {
    accessorKey: "city",
    header: "Cidade",
    accessorFn: (data: Address) =>
      data.district.city.abbreviation.toUpperCase(),
  },
  {
    accessorKey: "state",
    header: "UF",
    accessorFn: (data: Address) => data.district.city.state.abbreviation,
  },
  {
    accessorKey: "cep",
    header: "CEP",
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
                <span className="sr-only">Edit</span>
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar endereço</DialogTitle>
              </DialogHeader>

              <AddressForm {...editAddress(row.original)} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Trash className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Remover endereço</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja remover o endereço?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="mb-2">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => handlerDelete(Number(id), row.original.id)}
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
