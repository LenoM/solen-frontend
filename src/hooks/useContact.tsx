import { toast } from "sonner";
import { useState } from "react";

import type { ContactType } from "@/features/client/forms/contact";
import type { ClientType } from "@/features/client/forms/personal";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";
import { queryClient } from "@/lib/react-query";

const BASE_URL = import.meta.env.VITE_API_URL + "/contact";

export default function useContact() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);
  const [contactsList, setContactsList] = useState<ContactType[]>([]);

  const createContact = async ({
    value,
    clientId,
    contactType,
    isWhatsapp,
  }: ContactType) => {
    const body: BodyInit = JSON.stringify({
      value,
      clientId,
      contactType,
      isWhatsapp,
    });

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        queryClient.setQueryData(
          ["getClientById", { clientId }],
          (prev: ClientType) => {
            if (prev && prev.contacts) {
              return { ...prev, contacts: [...prev.contacts, res] };
            }
          }
        );

        toast.success("Contato salvo", {
          description: `O contato #${res.id} foi salvo`,
        });

        return;
      }

      toast.error("Erro na inclusão do contato", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na inclusão do contato", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async ({
    id,
    clientId,
    value,
    contactType,
    isWhatsapp,
  }: ContactType) => {
    setLoading(true);

    const url = `${BASE_URL}/${id}`;

    const body: BodyInit = JSON.stringify({
      id,
      clientId,
      value,
      contactType,
      isWhatsapp,
    });

    const params: RequestInit = {
      method: "PUT",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        queryClient.setQueryData(
          ["getClientById", { clientId }],
          (prev: ClientType) => {
            prev.contacts = prev?.contacts
              ?.filter((d) => d.id !== res.id)
              .concat(res);
            return prev;
          }
        );

        toast.success("Contato salvo", {
          description: `O contato #${res.id} foi salvo`,
        });

        return;
      }

      toast.error("Erro na atualização do contato", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na atualização do contato", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (clientId: number, contactId: number) => {
    setLoading(true);

    const url = `${BASE_URL}/${contactId}`;

    const params: RequestInit = {
      method: "DELETE",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        queryClient.setQueryData(
          ["getClientById", { clientId }],
          (prev: ClientType) => {
            prev.contacts = prev?.contacts?.filter((d) => d.id !== res.id);
            return prev;
          }
        );

        toast.success("Contato deletado", {
          description: `O contato #${contactId} foi removido com sucesso!`,
        });

        return;
      }

      toast.error("Erro na atualização do contato", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na atualização do contato", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
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
