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
import { toast } from "sonner";

import { normalizePhoneNumber } from "@/utils/format-utils";
import { deleteContact } from "@/services/contact";
import ContactForm, { ContactType } from "@/features/client/forms/contact";

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

const handlerDelete = async (contactId: number) => {
  try {
    const result = await deleteContact(contactId);

    if (result.id) {
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

const formatContact = (data: any) => {
  if (data.contactType === "Email") {
    return data.value;
  }

  return normalizePhoneNumber(data.value);
};

export const columns: ColumnDef<Contact>[] = [
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Edit</span>
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar contato</DialogTitle>
              </DialogHeader>

              <ContactForm {...editContact(row.original)} />
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
