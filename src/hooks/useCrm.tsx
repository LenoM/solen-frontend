import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import useFetcher from "@/lib/request";
import { queryClient } from "@/lib/react-query";
import { CrmHistoryType } from "@/features/crm/crm-form";
import type { ClientType } from "@/features/client/client-schema";
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
    createCrm,
  };
}
