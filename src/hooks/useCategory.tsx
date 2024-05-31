import { toast } from "sonner";
import { useState } from "react";

import { Entity } from "@/utils/utils";
import { getHeader } from "@/utils/headers-utils";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";

const BASE_URL = import.meta.env.VITE_API_URL + "/category";

export default function useCategory() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState<Entity[]>([]);

  const getCategories = async () => {
    setLoading(true);

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        setCategoryList(res);
        return;
      }

      toast.error("Erro na lista de categorias", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de categorias", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, categoryList, getCategories };
}
