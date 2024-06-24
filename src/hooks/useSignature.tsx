import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { SignatureType } from "@/features/client/forms/signature";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

export default function useSignature() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);

  const createSignature = async (
    clientId: number,
    productId: number,
    initialDate: Date,
    finalDate: Date | null | undefined
  ) => {
    setLoading(true);

    const url = `signature/client/${clientId}/product/${productId}`;

    const body: BodyInit = JSON.stringify({
      initialDate,
      finalDate,
    });

    const response = await fetcher.post(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getSignatureByClient", { clientId }],
        response
      );

      toast.success("Assinatura adicionada", {
        description: "A assinatura foi adicionada com sucesso!",
      });
    }

    setLoading(false);
  };

  const deleteSignature = async (
    signatureId: number,
    clientId: number,
    finalDate: Date
  ) => {
    setLoading(true);

    const url = `signature/${signatureId}`;

    const body: BodyInit = JSON.stringify({
      finalDate,
    });

    const response = await fetcher.del(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getSignatureByClient", { clientId }],
        response
      );

      toast.success("Assinatura cancelada", {
        description: "A assinatura foi cancelada com sucesso!",
      });
    }

    setLoading(false);
  };

  const getSignatureByClient = (clientId: number) => {
    return useQuery<SignatureType[]>({
      queryKey: ["getSignatureByClient", { clientId }],
      queryFn: () => retriveSignatureByClient(clientId),
      refetchOnMount: false,
    });
  };

  const retriveSignatureByClient = async (clientId: number) => {
    setLoading(true);

    if (!isNaN(clientId)) {
      const url = `signature/client/${clientId}`;
      const response = await fetcher.get(url);

      if (response) {
        setLoading(false);
        return response;
      }
    }

    setLoading(false);
  };

  return {
    loading,
    createSignature,
    getSignatureByClient,
    deleteSignature,
  };
}
