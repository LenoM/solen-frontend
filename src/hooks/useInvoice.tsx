import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { InvoiceType } from "@/features/invoice/forms/invoice";
import type { InvoiceFilterType } from "@/features/invoice/forms/filter";
import type { BatchFilterType } from "@/features/batch-generator/form";
import { loadInvoiceData } from "@/features/invoice/forms/invoice";
import { toDateString } from "@/utils/format-utils";
import { queryClient } from "@/lib/react-query";
import useFetcher, { ResponseFormat } from "@/lib/request";

export default function useInvoice() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState<InvoiceType>();
  const [batchList, setBatchList] = useState([]);

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

    const url = `invoice?${query}`;

    const response = await fetcher.get(url);

    if (response) {
      setLoading(false);
      queryClient.setQueryData(["getInvoices"], response);
      return response;
    }

    setLoading(false);
  };

  const getInvoice = async (invoiceId: number) => {
    setLoading(true);

    if (!isNaN(invoiceId)) {
      const url = `invoice/${invoiceId}`;
      const response = await fetcher.get(url);

      if (response) {
        setCurrentData(response);
      }
    } else {
      setCurrentData(loadInvoiceData());
    }

    setLoading(false);
  };

  const getBatchs = async () => {
    setLoading(true);

    const url = `invoice/batch`;
    const response = await fetcher.get(url);

    if (response) {
      setBatchList(response);
    }

    setLoading(false);
  };

  const printInvoice = async (data: number[]) => {
    setLoading(true);

    const body: BodyInit = JSON.stringify(data);
    const response = await fetcher.post(
      "invoice/print",
      body,
      ResponseFormat.TEXT
    );

    if (response) {
      toast.success("Impressão de boleto", {
        description: `O boleto está disponível`,
        action: {
          label: "Baixar",
          onClick: () => window.open(response),
        },
      });
    }

    setLoading(false);
  };

  const createManyInvoice = async (data: BatchFilterType) => {
    setLoading(true);
    if (!data.categoryId || data.categoryId < 1) {
      data.categoryId = null;
    }

    if (!data.productId || data.productId < 1) {
      data.productId = null;
    }

    if (!data.clientId || data.clientId < 1) {
      data.clientId = null;
    }

    if (!data.companyId || data.companyId < 1) {
      data.companyId = null;
    }

    if (!data.bankAccountId || data.bankAccountId < 1) {
      data.bankAccountId = null;
    }

    const body: BodyInit = JSON.stringify(data);

    const response = await fetcher.post("invoice/all", body);

    if (response) {
      toast.success("Lote adicionado com sucesso", {
        description: `O lote foi adicionado`,
      });
    }

    setLoading(false);
  };

  const createInvoice = async (data: InvoiceType) => {
    setLoading(true);

    const { invoiceDetail, ...rest } = data;

    const invoiceitem = {
      invoice: rest,
      items: invoiceDetail,
    };

    const body: BodyInit = JSON.stringify(invoiceitem);
    const response = await fetcher.post("invoice", body);

    if (response) {
      toast.success("Boleto adicionado com sucesso", {
        description: `O boleto foi adicionado`,
      });
    }

    setLoading(false);
  };

  const updateInvoice = async (invoiceId: number, data: InvoiceType) => {
    setLoading(true);

    const { invoiceDetail, ...rest } = data;

    const invoiceitem = {
      invoice: rest,
      items: invoiceDetail,
    };

    const url = `invoice/${invoiceId}`;
    const body: BodyInit = JSON.stringify(invoiceitem);
    const response = await fetcher.put(url, body);

    if (response) {
      toast.success("Boleto atualizado com sucesso", {
        description: `O boleto foi atualizado`,
      });
    }

    setLoading(false);
  };

  const sendInvoice = async (data: number[]) => {
    setLoading(true);

    const url = `invoice/send`;
    const body: BodyInit = JSON.stringify(data);
    const response = await fetcher.post(url, body);

    if (response) {
      toast.success("Boleto enviado com sucesso", {
        description: `O boleto foi adicionado a fila para envio`,
      });
    }

    setLoading(false);
  };

  return {
    loading,
    currentData,
    getBatchs,
    batchList,
    getInvoice,
    sendInvoice,
    printInvoice,
    getInvoices,
    createInvoice,
    createManyInvoice,
    updateInvoice,
    retrieveInvoices,
  };
}
