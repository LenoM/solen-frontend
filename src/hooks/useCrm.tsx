import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import useFetcher from "@/lib/request";
import { queryClient } from "@/lib/react-query";
import type { ClientType } from "@/features/client/client-schema";
import type { CrmHistoryType } from "@/features/crm/crm-form";
import type { CollectHistoryType } from "@/features/crm/collection-form";

export default function useCrm() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getNextCall = async () => {
    setLoading(true);

    const response = await fetcher.get<number>("crm/next-call");

    if (response && response > 0) {
      navigate(`/client/${response}`);

      toast.info("Ligação iniciada", {
        description: "Verifique o histórico de chamadas",
      });
    }

    if (Number(response) === -1) {
      toast.success("Parabéns!", {
        description: "Não há novas ligações",
      });
    }

    setLoading(false);
  };

  const updateCollect = async (data: CollectHistoryType | CrmHistoryType) => {
    setLoading(true);

    const {
      id,
      clientId,
      statusId,
      returnDate,
      description,
      type,
      originId,
      motiveId,
      subMotiveId,
      collectStatusId,
    } = data;

    const url = `crm/${id}`;

    const body: BodyInit = JSON.stringify({
      id,
      clientId,
      type,
      returnDate,
      description,
      statusId: Number(statusId),
      originId: Number(originId) ?? null,
      motiveId: Number(motiveId) ?? null,
      subMotiveId: Number(subMotiveId) ?? null,
      collectStatusId: Number(collectStatusId) ?? null,
    });

    const response = await fetcher.put<CrmHistoryType>(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getClientById", { clientId }],
        (prev: ClientType) => {
          prev.crmHistory = prev?.crmHistory
            ?.filter((d) => d.id !== response.id)
            .concat(response);
          return prev;
        }
      );

      toast.success("Atendimento salvo", {
        description: `O histórico de tendimento #${response.id} foi salvo`,
      });
    }

    setLoading(false);
  };

  const createCrm = async (data: CrmHistoryType) => {
    setLoading(true);

    const {
      returnDate,
      description,
      statusId,
      motiveId,
      originId,
      subMotiveId,
      clientId,
      type,
    } = data;

    const body: BodyInit = JSON.stringify({
      returnDate,
      description,
      statusId: Number(statusId),
      motiveId: Number(motiveId),
      subMotiveId: Number(subMotiveId),
      originId: Number(originId),
      clientId,
      type,
    });

    const response = await fetcher.post<CrmHistoryType>("crm", body);

    if (response) {
      queryClient.setQueryData(
        ["getClientById", { clientId }],
        (prev: ClientType) => {
          if (prev && prev.crmHistory) {
            return { ...prev, crmHistory: [...prev.crmHistory, response] };
          }
        }
      );

      toast.success("Histórico de atendimento salvo", {
        description: `O atendimento foi salvo`,
      });
    }

    setLoading(false);
  };

  return {
    loading,
    getNextCall,
    updateCollect,
    createCrm,
  };
}
