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

const formatAddress = (data: AddressDataType) => {
  return (
    data.addressType?.abbreviation +
    `. ${data.address}` +
    (data.number ? `, ${data.number}` : "") +
    (data.complement ? `, ${data.complement}` : "")
  );
};

interface AddressFormProps {
  title: string;
  children: JSX.Element[] | JSX.Element;
  formData: AddressDataType;
}

const AddressDialog = ({ title, children, formData }: AddressFormProps) => {
  const { clientId } = useParams();
  const { loading, createAddress, updateAddress } = useAddress();

  const handlerSubmit = async (newData: AddressDataType) => {
    const isUpdate = newData.id! > 0;

    if (isUpdate) {
      await updateAddress(Number(clientId), newData);
    } else {
      await createAddress(Number(clientId), newData);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <AddressForm
          isSaveLoading={loading}
          data={formData}
          onSubmit={(newData: AddressDataType) => handlerSubmit(newData)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default function Address() {
  const { clientId } = useParams();
  const { deleteAddress, getAddressByClient } = useAddress();
  const { data: address } = getAddressByClient(Number(clientId));

  const handlerDelete = async (clientId: number, addressId: number) => {
    await deleteAddress(clientId, addressId);
  };

  const columns: ColumnDef<AddressDataType>[] = [
    {
      accessorKey: "address",
      header: "Endereço",
      accessorFn: (data: AddressDataType) => formatAddress(data).toUpperCase(),
    },
    {
      accessorKey: "district",
      header: "Bairro",
      accessorFn: (data: AddressDataType) =>
        data?.district?.abbreviation.toUpperCase(),
    },
    {
      accessorKey: "city",
      header: "Cidade",
      accessorFn: (data: AddressDataType) =>
        data?.city?.abbreviation.toUpperCase(),
    },
    {
      accessorKey: "state",
      header: "UF",
      accessorFn: (data: AddressDataType) => data?.state?.abbreviation,
    },
    {
      accessorKey: "cep",
      header: "CEP",
      accessorFn: (data: AddressDataType) => normalizeCepNumber(data.cep),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <AddressDialog
              title="Editar endereço"
              formData={loadAddressData(row.original)}
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
                      handlerDelete(Number(clientId), Number(row.original.id))
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

      {address && <DataTable columns={columns} data={address} />}
    </>
  );
}
