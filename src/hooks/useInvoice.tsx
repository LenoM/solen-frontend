import { toast } from "sonner";
import { useState } from "react";

import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/invoice";

export default function useInvoice() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);

  const printInvoice = async (data: number[]) => {
    const url = `${BASE_URL}/print`;

    const body: BodyInit = JSON.stringify(data);

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.text();

      if (response.ok && res) {
        toast.success("Impressão de boleto", {
          description: `O boleto está disponível`,
          action: {
            label: "Baixar",
            onClick: () => window.open(res),
          },
        });

        return;
      }

      toast.error("Impressão de boleto", {
        description: `O boleto não está disponível`,
      });
    } catch (err) {
      toast.error("Falha na impressão do boleto", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendInvoice = async (data: number[]) => {
    const url = `${BASE_URL}/send`;

    const body: BodyInit = JSON.stringify(data);

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        toast.error("Boleto enviado com sucesso", {
          description: `O boleto foi adicionado a fila para envio`,
        });

        return;
      }

      toast.error("Erro no envio do boleto", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha no envio do boleto", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendInvoice,
    printInvoice,
  };
}
