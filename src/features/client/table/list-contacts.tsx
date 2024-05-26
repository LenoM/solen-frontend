import { toast } from "sonner";
import { useState } from "react";
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

import {
  deleteContact,
  createContact,
  updateContact,
} from "@/services/contact";

import ContactForm, {
  loadContactData,
  ContactType,
} from "@/features/client/forms/contact";

export type Contact = {
  id: number;
  clientId: number;
  value: string;
  isWhatsapp: boolean;
  contactType: string;
};

const editContact = (data: Contact): ContactType => {
  return {
    id: data.id,
    clientId: data.clientId,
    value: data.value,
    isWhatsapp: data.isWhatsapp,
    contactType: data.contactType,
  };
};

const formatContact = (data: any) => {
  if (data.contactType === "Email") {
    return data.value;
  }

  return normalizePhoneNumber(data.value);
};

export interface ContactFormProps {
  title: string;
  children: JSX.Element[] | JSX.Element;
  formData: ContactType;
}

export function Contacts(data: any) {
  const [contact, setContact] = useState(data?.contact);

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

  const handlerSubmit = async (newData: any) => {
    try {
      const isUpdate = newData.id! > 0;

      if (isUpdate) {
        newData = await updateContact(newData);
      } else {
        newData = await createContact(newData);
      }

      if (!newData.id) {
        toast.error("Erro no cadastro", {
          description: "Ocorreu um erro ao tentar cadastrar o contato",
        });

        return;
      }

      setContact((prev: any[]) =>
        prev.filter((d) => d.id !== newData.id).concat(newData)
      );

      toast.success("Contato salvo", {
        description: `O contato #${newData.id} foi salvo`,
      });
    } catch (error) {
      toast.error("Falha no cadastro", {
        description: "Ocorreu uma falha ao tentar cadastrar o contato",
      });
    }
  };

  const handlerDelete = async (contactId: number) => {
    try {
      const result = await deleteContact(contactId);

      if (result.id) {
        setContact((prev: any[]) => prev.filter((d) => d.id !== result.id));

        toast.success("Contato deletado", {
          description: `O contato #${contactId} foi removido com sucesso!`,
        });

        return;
      }

      toast.error("Erro ao remover o Contato", {
        description: `Ocorreu um erro ao remover o contato #${contactId}.`,
      });
    } catch (error) {
      toast.error("Falha ao remover o Contato", {
        description: `Ocorreu uma falha ao remover o contato.`,
      });
    }
  };

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "contactType",
      header: "Tipo",
    },
    {
      accessorKey: "value",
      header: "Contato",
      accessorFn: (data: Contact) => formatContact(data),
    },
    {
      accessorKey: "isWhatsapp",
      header: "WhatsApp?",
      accessorFn: (data: Contact) => (data.isWhatsapp ? "Sim" : "Não"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <ContactDialog
              title="Editar contato"
              formData={editContact(row.original)}
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
                    onClick={() => handlerDelete(row.original.id)}
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
      <DataTable columns={columns} data={contact} />
    </>
  );
}
