import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { DocumentDataType } from "@/features/client/forms/document";
import type { Entity } from "@/utils/utils";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function useDocument() {
  const headers = getHeader();
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);
  const [documentTypeList, setDocumentTypeList] = useState<Entity[]>([]);

  const getDocumentType = async () => {
    setLoading(true);

    const response = await fetcher.get<Entity[]>("document-type");

    if (response) {
      setDocumentTypeList(response);
    }

    setLoading(false);
  };

  const createDocument = async (data: DocumentDataType) => {
    setLoading(true);

    const { clientId, docTypeId, description } = data;

    const url = `${BASE_URL}/client/${clientId}/document`;

    const body = new FormData();
    body.append("file", data.file);
    body.append("clientId", clientId?.toString() ?? "");
    body.append("docTypeId", docTypeId?.toString() ?? "");
    body.append("description", description ?? "");

    delete headers["Content-Type"];

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response && response.ok && res?.id) {
        queryClient.setQueryData(
          ["getDocumentsByClient", { clientId }],
          (prev: DocumentDataType[]) => {
            if (prev) {
              return [...prev, res];
            }
          }
        );

        toast.success("Documento salvo", {
          description: `O documento foi salvo`,
        });

        setLoading(false);

        return;
      }

      toast.error("Erro no upload", {
        description: res.message,
      });

      setLoading(false);
    } catch (error) {
      toast.error("Falha no upload", {
        description: `${SERVER_ERROR_MESSAGE} /upload`,
      });
      setLoading(false);
    }
  };

  const getDocumentByClient = (clientId: number) => {
    return useQuery<DocumentDataType[]>({
      queryKey: ["getDocumentsByClient", { clientId }],
      queryFn: () => retriveDocumentByClient(clientId),
      refetchOnMount: false,
    });
  };

  const retriveDocumentByClient = async (clientId: number) => {
    setLoading(true);

    if (!isNaN(clientId)) {
      const url = `client/${clientId}/document`;
      const response = await fetcher.get<DocumentDataType[]>(url);

      if (response) {
        setLoading(false);
        return response;
      }
    }

    setLoading(false);
    return [];
  };

  return {
    loading,
    createDocument,
    getDocumentType,
    getDocumentByClient,
    documentTypeList,
  };
}
