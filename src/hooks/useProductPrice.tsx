import { toast } from "sonner";
import { useState } from "react";

import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/product-price";

export default function useProductPrice() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);

  const createProductPrice = async (
    productId: number,
    clientId: number,
    price: number,
    initialDate: Date,
    finalDate: Date | null | undefined
  ) => {
    const body: BodyInit = JSON.stringify({
      productId,
      clientId,
      price,
      initialDate,
      finalDate,
    });

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        return res;
      }

      toast.error("Erro na inclusão da tabela de preço", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na inclusão da tabela de preço", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createProductPrice,
  };
}
