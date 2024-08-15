import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { DocumentDataType } from "@/features/client/forms/document";
import type { Entity } from "@/utils/utils";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

export default function useDocument() {
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
    getDocumentType,
    getDocumentByClient,
    documentTypeList,
  };
}
