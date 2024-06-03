import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Pencil, PlusCircle, Trash } from "lucide-react";
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

import AddressForm, { loadAddressData } from "@/features/client/forms/address";

import type { AddressDataType } from "@/features/client/forms/address";

import { normalizeCepNumber } from "@/utils/format-utils";
import { DataTable } from "@/components/dataTable";
import useAddress from "@/hooks/useAddress";

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

type Address = {
  id: number;
  address: string;
  addressType: AddressType;
  addressCategory: string;
  district: District;
  city: City;
  state: State;
  cep: string;
  number: number;
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

const editAddress = (data: Address): AddressDataType => {
  return {
    id: data.id,
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

export interface AddressFormProps {
  title: string;
  children: JSX.Element[] | JSX.Element;
  formData: AddressDataType;
}

export function Address(data: any) {
  const {
    addressList,
    setAddresssList,
    createAddress,
    deleteAddress,
    updateAddress,
  } = useAddress();

  useEffect(() => {
    setAddresssList(data?.address);
  }, []);

  const { clientId } = useParams();

  const AddressDialog = ({ title, children, formData }: AddressFormProps) => {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <AddressForm
            data={formData}
            onSubmit={(newData: AddressDataType) => handlerSubmit(newData)}
          />
        </DialogContent>
      </Dialog>
    );
  };

  const handlerSubmit = async (newData: any) => {
    const isUpdate = newData.id! > 0;

    if (isUpdate) {
      newData = await updateAddress(Number(clientId), newData);
    } else {
      newData = await createAddress(Number(clientId), newData);
    }

    setAddresssList((prev) =>
      prev.filter((end) => end.id !== newData.id).concat(newData)
    );
  };

  const handlerDelete = async (clientId: number, addressId: number) => {
    await deleteAddress(clientId, addressId);
  };

  const columns: ColumnDef<Address>[] = [
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
      accessorFn: (data: Address) => normalizeCepNumber(data.cep),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <AddressDialog
              title="Editar endereço"
              formData={editAddress(row.original)}
            >
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Edit</span>
                <Pencil className="h-4 w-4" />
              </Button>
            </AddressDialog>

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
                    onClick={() =>
                      handlerDelete(Number(clientId), row.original.id)
                    }
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
        <AddressDialog title="Adicionar endereço" formData={loadAddressData()}>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo
          </Button>
        </AddressDialog>
      </div>

      <DataTable columns={columns} data={addressList} />
    </>
  );
}
