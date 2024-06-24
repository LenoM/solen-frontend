import { toast } from "sonner";
import { useState } from "react";

import type { ContactType } from "@/features/client/forms/contact";
import type { ClientType } from "@/features/client/forms/personal";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

export default function useContact() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);
  const [contactsList, setContactsList] = useState<ContactType[]>([]);

  const createContact = async (data: ContactType) => {
    setLoading(true);

    const { value, clientId, contactType, isWhatsapp } = data;

    const body: BodyInit = JSON.stringify({
      value,
      clientId,
      contactType,
      isWhatsapp,
    });

    const response = await fetcher.post("contact", body);

    if (response) {
      queryClient.setQueryData(
        ["getClientById", { clientId }],
        (prev: ClientType) => {
          if (prev && prev.contacts) {
            return { ...prev, contacts: [...prev.contacts, response] };
          }
        }
      );

      toast.success("Contato salvo", {
        description: `O contato #${response.id} foi salvo`,
      });
    }

    setLoading(false);
  };

  const updateContact = async (data: ContactType) => {
    setLoading(true);

    const { id, clientId, value, contactType, isWhatsapp } = data;

    const url = `contact/${id}`;

    const body: BodyInit = JSON.stringify({
      id,
      clientId,
      value,
      contactType,
      isWhatsapp,
    });

    const response = await fetcher.put(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getClientById", { clientId }],
        (prev: ClientType) => {
          prev.contacts = prev?.contacts
            ?.filter((d) => d.id !== response.id)
            .concat(response);
          return prev;
        }
      );

      toast.success("Contato salvo", {
        description: `O contato #${response.id} foi salvo`,
      });
    }

    setLoading(false);
  };

  const deleteContact = async (clientId: number, contactId: number) => {
    setLoading(true);

    const url = `contact/${contactId}`;

    const response = await fetcher.del(url);

    if (response) {
      queryClient.setQueryData(
        ["getClientById", { clientId }],
        (prev: ClientType) => {
          prev.contacts = prev?.contacts?.filter((d) => d.id !== response.id);
          return prev;
        }
      );

      toast.success("Contato deletado", {
        description: `O contato #${contactId} foi removido com sucesso!`,
      });
    }
    setLoading(false);
  };

  return {
    loading,
    contactsList,
    setContactsList,
    deleteContact,
    createContact,
    updateContact,
  };
}
