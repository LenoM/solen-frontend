import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { InvoiceType } from "@/features/invoice/forms/invoice";
import type { InvoiceFilterType } from "@/features/invoice/forms/filter";
import { loadInvoiceData } from "@/features/invoice/forms/invoice";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { toDateString } from "@/utils/format-utils";
import { getHeader } from "@/utils/headers-utils";
import { queryClient } from "@/lib/react-query";

const BASE_URL = import.meta.env.VITE_API_URL + "/invoice";

export default function useInvoice() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState<InvoiceType>();

  const getInvoices = async (filter: InvoiceFilterType) => {
    return useQuery<InvoiceType[]>({
      queryKey: ["getInvoices"],
      queryFn: () => retrieveInvoices(filter),
      enabled: false,
    });
  };

  const retrieveInvoices = async (filter: InvoiceFilterType) => {
    setLoading(true);

    const query = new URLSearchParams();

    if (filter.invoiceId) {
      query.append("invoiceId", filter.invoiceId.toString());
    }

    if (filter.initialDueDate) {
      query.append("initialDueDate", toDateString(filter.initialDueDate) ?? "");
    }

    if (filter.finalDueDate) {
      query.append("finalDueDate", toDateString(filter.finalDueDate) ?? "");
    }

    if (filter.initialReferenceDate) {
      query.append(
        "initialReferenceDate",
        toDateString(filter.initialReferenceDate) ?? ""
      );
    }

    if (filter.finalReferenceDate) {
      query.append(
        "finalReferenceDate",
        toDateString(filter.finalReferenceDate) ?? ""
      );
    }

    const url = `${BASE_URL}?${query}`;
    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        queryClient.setQueryData(["getInvoices"], res);
        return res;
      }

      toast.error("Erro na lista de boletos", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de boletos", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getInvoice = async (invoiceId: number) => {
    setLoading(true);
    const url = `${BASE_URL}/${invoiceId}`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      if (!isNaN(invoiceId)) {
        const response = await fetch(url, params);
        const res = await response.json();

        if (response.ok && res) {
          setCurrentData(res);
          return;
        }

        toast.error("Erro na lista de boletos", {
          description: res.message,
        });
      } else {
        setCurrentData(loadInvoiceData());
      }
    } catch (err) {
      toast.error("Falha na lista de boletos", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

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

  const createInvoice = async (data: InvoiceType) => {
    const { invoiceDetail, ...rest } = data;

    const invoiceitem = {
      invoice: rest,
      items: invoiceDetail,
    };

    const body: BodyInit = JSON.stringify(invoiceitem);

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        toast.success("Boleto adicionado com sucesso", {
          description: `O boleto foi adicionado`,
        });

        return;
      }

      toast.error("Erro no cadastro do boleto", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha no cadastro do boleto", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (invoiceId: number, data: InvoiceType) => {
    const url = `${BASE_URL}/${invoiceId}`;

    const { invoiceDetail, ...rest } = data;

    const invoiceitem = {
      invoice: rest,
      items: invoiceDetail,
    };

    const body: BodyInit = JSON.stringify(invoiceitem);

    const params: RequestInit = {
      method: "PUT",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        toast.success("Boleto atualizado com sucesso", {
          description: `O boleto foi atualizado`,
        });

        return;
      }

      toast.error("Erro na atualização do boleto", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na atualização do boleto", {
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
        toast.success("Boleto enviado com sucesso", {
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
    currentData,
    getInvoice,
    sendInvoice,
    printInvoice,
    getInvoices,
    createInvoice,
    updateInvoice,
    retrieveInvoices,
  };
}
