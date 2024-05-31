import { toast } from "sonner";
import { useState } from "react";

import { Entity } from "@/utils/utils";
import { getHeader } from "@/utils/headers-utils";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";

const BASE_URL = import.meta.env.VITE_API_URL + "/company";

export default function useCompany() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);
  const [companyList, setCompanyList] = useState<Entity[]>([]);

  const getCompany = async () => {
    setLoading(true);

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        setCompanyList(res);
        return;
      }

      toast.error("Erro na lista de empresas", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de empresas", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, companyList, getCompany };
}
