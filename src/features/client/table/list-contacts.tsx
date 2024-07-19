import { Pencil, Trash, PlusCircle } from "lucide-react";
import { DataTable } from "@/components/dataTable";
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

import { normalizePhoneNumber } from "@/utils/format-utils";

import ContactForm, { loadContactData } from "@/features/client/forms/contact";
import type { ContactType } from "@/features/client/forms/contact";
import useContact from "@/hooks/useContact";
import { useParams } from "react-router-dom";
import useClient from "@/hooks/useClient";

const formatContact = (data: ContactType) => {
  if (data.contactType === "Email") {
    return data.value;
  }

  return normalizePhoneNumber(data.value);
};

interface ContactFormProps {
  title: string;
  children: JSX.Element[] | JSX.Element;
  formData: ContactType;
}

export default function Contacts() {
  const { clientId } = useParams();
  const { getClientByid } = useClient();
  const { data: client } = getClientByid(Number(clientId));
  const { updateContact, createContact, deleteContact } = useContact();

  const ContactDialog = ({ title, children, formData }: ContactFormProps) => {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ContactForm
            data={formData}
            onSubmit={(newData: ContactType) => handlerSubmit(newData)}
          />
        </DialogContent>
      </Dialog>
    );
  };

  const handlerSubmit = async (newData: ContactType) => {
    const isUpdate = newData.id! > 0;

    if (isUpdate) {
      await updateContact(newData);
    } else {
      newData.clientId = Number(clientId)
      await createContact(newData);
    }
  };

  const handlerDelete = async (clientId: number, contactId: number) => {
    await deleteContact(clientId, contactId);
  };

  const columns: ColumnDef<ContactType>[] = [
    {
      accessorKey: "contactType",
      header: "Tipo",
    },
    {
      accessorKey: "value",
      header: "Contato",
      accessorFn: (data: ContactType) => formatContact(data),
    },
    {
      accessorKey: "isWhatsapp",
      header: "WhatsApp?",
      accessorFn: (data: ContactType) => (data.isWhatsapp ? "Sim" : "Não"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <ContactDialog
              title="Editar contato"
              formData={loadContactData(row.original)}
            >
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Edit</span>
                <Pencil className="h-4 w-4" />
              </Button>
            </ContactDialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Trash className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Remover contato</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja remover o contato?
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
                      handlerDelete(
                        Number(row.original.clientId),
                        Number(row.original.id)
                      )
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
        <ContactDialog title="Adicionar contato" formData={loadContactData()}>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo
          </Button>
        </ContactDialog>
      </div>
      {client?.contacts && (
        <DataTable columns={columns} data={client.contacts} />
      )}
    </>
  );
}
