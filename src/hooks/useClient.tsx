import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import type { ClientType } from "@/features/client/client-schema";
import { toDateValue } from "@/utils/format-utils";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

const MIN_INPUT_LENGTH = 5;

export default function useClient() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientsList, setClientsList] = useState<ClientType[]>([]);

  const getClients = async () => {
    setLoading(true);

    const response = await fetcher.get<ClientType[]>("client");

    if (response) {
      setClientsList(response);
    }

    setLoading(false);
  };

  const getFilterClient = (input: string | undefined) => {
    return useQuery<ClientType[] | undefined>({
      queryKey: ["getClient"],
      queryFn: () => getClient(input),
      enabled: !!input && input.length > 5 && input.length % 2 == 0,
    });
  };

  const getClient = async (
    input: string | undefined
  ): Promise<ClientType[] | undefined> => {
    if (!input || input.length < MIN_INPUT_LENGTH) {
      toast.warning("Busca de clientes", {
        description: `Informe ao menos ${MIN_INPUT_LENGTH} caracteres`,
      });
      return;
    }

    setLoading(true);

    const url = `client/filter/${input}`;

    const response = await fetcher.get<ClientType[]>(url);

    if (response) {
      queryClient.setQueryData(["getClient"], response);
      setLoading(false);
      return response;
    }

    setLoading(false);
  };

  const getFamily = async (id: number) => {
    setLoading(true);

    const url = `client/family/${id}`;

    const response = await fetcher.get<ClientType[]>(url);

    if (response) {
      setClientsList(response);
    }

    setLoading(false);
  };

  const updateHolderStatus = (holderId: number) => {
    queryClient.setQueryData(["getClient"], (prev: ClientType[]) => {
      if (prev) {
        const clientIndex = prev.findIndex(
          (cli) => Number(cli.id) === holderId
        );

        const newClient = {
          ...prev[clientIndex],
          isActive: !prev[clientIndex].isActive,
        };

        const clients = [
          ...prev.slice(0, clientIndex),
          newClient,
          ...prev.slice(clientIndex + 1),
        ];

        return clients;
      }
    });
  };

  const updateClientStatus = (holderId: number, clientId: number) => {
    queryClient.setQueryData(
      ["getClientById", { clientId: holderId }],
      (prev: ClientType) => {
        if (prev?.dependents) {
          const clientIndex = prev.dependents.findIndex(
            (cli) => Number(cli.id) === clientId
          );

          const newClient = {
            ...prev.dependents[clientIndex],
            isActive: !prev.dependents[clientIndex].isActive,
          };

          const deps = [
            ...prev.dependents.slice(0, clientIndex),
            newClient,
            ...prev.dependents.slice(clientIndex + 1),
          ];

          return { ...prev, dependents: deps };
        }
      }
    );
  };

  const cancelClient = async (
    holderId: number,
    clientId: number,
    cancelDate: Date,
    reason: string | undefined
  ) => {
    setLoading(true);

    const url = `client/${clientId}/cancel`;

    const body: BodyInit = JSON.stringify({
      cancelDate,
      reason,
    });

    const response = await fetcher.patch<ClientType>(url, body);

    if (response) {
      if (holderId === clientId) {
        updateHolderStatus(clientId);
      } else {
        updateClientStatus(holderId, clientId);
      }

      toast.success("Cancelamento registrado", {
        description: "O cancelamento foi registrado",
      });
    }

    setLoading(false);
  };

  const reactivateClient = async (
    holderId: number,
    clientId: number,
    reactivatedDate: Date,
    dependents?: number[] | undefined
  ) => {
    setLoading(true);

    const url = `client/${clientId}/reactivate`;

    const body: BodyInit = JSON.stringify({
      reactivatedDate,
      dependents,
    });

    const response = await fetcher.patch<ClientType>(url, body);

    if (response) {
      if (holderId === clientId) {
        updateHolderStatus(clientId);
      } else {
        updateClientStatus(holderId, clientId);
      }

      toast.success("Reativação registrada", {
        description: "A reativação foi registrada",
      });
    }

    setLoading(false);
  };

  const getClientByid = (clientId: number) => {
    return useQuery<ClientType | undefined>({
      queryKey: ["getClientById", { clientId }],
      queryFn: () => retrieveClientByid(clientId),
      refetchOnMount: false,
      enabled: !!clientId,
    });
  };

  const retrieveClientByid = async (
    clientId: number
  ): Promise<ClientType | undefined> => {
    setLoading(true);

    if (clientId) {
      const url = `client/${clientId}`;
      const response = await fetcher.get<ClientType>(url);

      if (response) {
        return response;
      }
    }

    setLoading(false);
  };

  const updateClient = async (data: ClientType) => {
    setLoading(true);

    const {
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
    } = data;

    const url = `client/${id}`;

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

    const response = await fetcher.put<ClientType>(url, body);

    if (response) {
      queryClient.invalidateQueries({
        queryKey: ["getClientById", { clientId: id }],
      });

      toast.success("Cadastro salvo", {
        description: `O cliente #${response.id} foi salvo`,
      });
    }

    setLoading(false);
  };

  const createClient = async (data: ClientType) => {
    setLoading(true);

    const {
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
    } = data;

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

    const response = await fetcher.post<ClientType>("client", body);

    if (response) {
      toast.success("Cadastro salvo", {
        description: `O cliente #${response.id} foi salvo`,
      });
      navigate(`/client/${response.id}`);
    }

    setLoading(false);
  };

  const deleteClient = async (clientId: number) => {
    setLoading(true);
    const url = `client/${clientId}`;
    await fetcher.del<ClientType>(url);
    setLoading(false);
  };

  return {
    clientsList,
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
    getFilterClient,
  };
}
