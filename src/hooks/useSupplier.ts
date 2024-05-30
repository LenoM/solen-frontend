import { toast } from "sonner";
import { useState } from "react";

import { Entity } from "@/utils/utils";
import { getHeader } from "@/utils/headers-utils";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";

const BASE_URL = import.meta.env.VITE_API_URL + "/supplier";

export default function useSupplier() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);
  const [suppliersList, setSuppliersList] = useState<Entity[]>([]);

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const getSuppliers = async () => {
    setLoading(true);

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        setSuppliersList(res);
        return;
      }

      toast.error("Erro na lista de fornecedores", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de fornecedores", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, suppliersList, getSuppliers };
}
