import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ClientType, loadClientData } from "@/features/client/forms/personal";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { toDateValue } from "@/utils/format-utils";
import { getHeader } from "@/utils/headers-utils";

const MIN_INPUT_LENGTH = 5;
const BASE_URL = import.meta.env.VITE_API_URL + "/client";

export default function useClient() {
  const headers = getHeader();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clientsList, setClientsList] = useState<ClientType[]>([]);
  const [currentClient, setCurrentClient] = useState<any>();

  const getClients = async () => {
    setLoading(true);

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        setClientsList(res);
        return;
      }

      toast.error("Erro na lista de clientes", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de clientes", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getClient = async (input: string | undefined) => {
    if (!input || input.length < MIN_INPUT_LENGTH) {
      toast.warning("Busca de clientes", {
        description: `Informe ao menos ${MIN_INPUT_LENGTH} caracteres`,
      });
      return;
    }

    setLoading(true);

    const url = `${BASE_URL}/filter/${input}`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        setClientsList(res);
        return;
      }

      toast.error("Erro na lista de clientes", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de clientes", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getFamily = async (id: number) => {
    setLoading(true);

    const url = `${BASE_URL}/family/${id}`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        setClientsList(res);
        return;
      }

      toast.error("Erro na lista de dependentes", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de dependentes", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelClient = async (
    id: number,
    cancelDate: Date,
    reason: string | undefined
  ) => {
    setLoading(true);

    const url = `${BASE_URL}/${id}/cancel`;

    const body: BodyInit = JSON.stringify({
      cancelDate,
      reason,
    });

    const params: RequestInit = {
      method: "PATCH",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        toast.success("Cancelamento registrado", {
          description: "O cancelamento foi registrado",
        });

        return res;
      }

      toast.error("Erro no cancelamento de clientes", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha no cancelamento de clientes", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const reactivateClient = async (
    id: number,
    reactivatedDate: Date,
    dependents?: number[] | undefined
  ) => {
    setLoading(true);

    const url = `${BASE_URL}/${id}/reactivate`;

    const body: BodyInit = JSON.stringify({
      reactivatedDate,
      dependents,
    });

    const params: RequestInit = {
      method: "PATCH",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        toast.success("Reativação registrada", {
          description: "A reativação foi registrada",
        });
        return res;
      }

      toast.error("Erro na reativação de clientes", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na reativação de clientes", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getClientByid = async (clientId: string | undefined) => {
    setLoading(true);
    const url = `${BASE_URL}/${clientId}`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      if (clientId) {
        const response = await fetch(url, params);
        const res = await response.json();

        if (response.ok && res) {
          setCurrentClient(res);
          return;
        }

        toast.error("Erro na lista de clientes", {
          description: res.message,
        });
      } else {
        setCurrentClient(loadClientData());
      }
    } catch (err) {
      toast.error("Falha na lista de clientes", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async ({
    id,
    name,
    socialName,
    gender,
    cpf,
    rg,
    birthday,
    bondDate,
    referenceDate,
    fatherName,
    motherName,
    categoryId,
    companyId,
    holderId,
    kinship = "Titular",
  }: ClientType) => {
    setLoading(true);

    const url = `${BASE_URL}/${id}`;

    const body: BodyInit = JSON.stringify({
      name,
      socialName,
      gender,
      cpf,
      rg,
      birthday: toDateValue(birthday),
      bondDate: bondDate ? toDateValue(bondDate) : null,
      referenceDate: referenceDate ? toDateValue(referenceDate) : null,
      fatherName,
      motherName,
      categoryId,
      companyId,
      holderId,
      kinship,
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
        toast.success("Cadastro salvo", {
          description: `O cliente #${res.id} foi salvo`,
        });
        return;
      }

      toast.error("Erro na atualização do cliente", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na atualização do cliente", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const createClient = async ({
    name,
    socialName,
    gender,
    cpf,
    rg,
    birthday,
    bondDate,
    referenceDate,
    fatherName,
    motherName,
    categoryId,
    companyId,
    holderId,
    kinship = "Titular",
  }: ClientType) => {
    const body: BodyInit = JSON.stringify({
      name,
      socialName,
      gender,
      cpf,
      rg,
      birthday: toDateValue(birthday),
      bondDate: bondDate ? toDateValue(bondDate) : null,
      referenceDate: referenceDate ? toDateValue(referenceDate) : null,
      fatherName,
      motherName,
      categoryId,
      companyId,
      holderId,
      kinship,
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
        toast.success("Cadastro salvo", {
          description: `O cliente #${res.id} foi salvo`,
        });
        navigate(`/client/${res.id}`);
        return;
      }

      toast.error("Erro na inclusão do cliente", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na inclusão do cliente", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: number) => {
    const url = `${BASE_URL}/${id}`;

    const params: RequestInit = {
      method: "DELETE",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        setCurrentClient(res);
        return;
      }

      toast.error("Erro na exclusão do cliente", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na exclusão do cliente", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    clientsList,
    currentClient,
    loading,
    getClientByid,
    getFamily,
    getClient,
    getClients,
    createClient,
    deleteClient,
    updateClient,
    cancelClient,
    reactivateClient,
  };
}
