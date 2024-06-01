import { toast } from "sonner";
import { useState } from "react";

import { SignatureType } from "@/features/client/forms/signature";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/signature";

export default function useSignature() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);
  const [signatureList, setSignatureList] = useState<SignatureType[]>([]);

  const createSignature = async (
    clientId: number,
    productId: number,
    initialDate: Date,
    finalDate: Date | null | undefined
  ) => {
    const url = `${BASE_URL}/client/${clientId}/product/${productId}`;

    const body: BodyInit = JSON.stringify({
      initialDate,
      finalDate,
    });

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        toast.success("Assinatura adicionada", {
          description: "A assinatura foi adicionada com sucesso!",
        });

        return res;
      }

      toast.error("Erro na inclusão do assinatura", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na inclusão do assinatura", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSignature = async (signatureId: number, finalDate: Date) => {
    setLoading(true);

    const url = `${BASE_URL}/${signatureId}`;

    const body: BodyInit = JSON.stringify({
      finalDate,
    });

    const params: RequestInit = {
      method: "DELETE",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        toast.success("Assinatura cancelada", {
          description: "A assinatura foi cancelada com sucesso!",
        });

        return;
      }

      toast.error("Erro no cancelamento do assinatura", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha no cancelamento do assinatura", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getSignatureByClient = async (clientId: number) => {
    setLoading(true);
    const url = `${BASE_URL}/client/${clientId}`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      if (!isNaN(clientId)) {
        const response = await fetch(url, params);
        const res = await response.json();

        if (response.ok && res) {
          setSignatureList(res);
          return;
        }

        toast.error("Erro na lista de assinaturas", {
          description: res.message,
        });
      }
    } catch (err) {
      toast.error("Falha na lista de assinaturas", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    signatureList,
    setSignatureList,
    loading,
    createSignature,
    getSignatureByClient,
    deleteSignature,
  };
}
