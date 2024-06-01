import { toast } from "sonner";
import { useState } from "react";

import { getHeader } from "@/utils/headers-utils";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { DiscountType } from "@/features/client/forms/discount";

const BASE_URL = import.meta.env.VITE_API_URL + "/discount";

export default function useDiscount() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);
  const [discountList, setDiscountList] = useState<DiscountType[]>([]);

  const createDiscount = async (
    clientId: number,
    productId: number,
    price: number,
    description: string | undefined,
    initialDate: Date,
    finalDate: Date | null | undefined
  ) => {
    const url = `${BASE_URL}/client/${clientId}`;

    const body: BodyInit = JSON.stringify({
      clientId,
      productId,
      price,
      description,
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
        toast.success("Desconto adicionado", {
          description: "O desconto foi adicionado com sucesso!",
        });

        return res;
      }

      toast.error("Erro na inclusão do desconto", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na inclusão do desconto", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscount = async (id: number, finalDate: Date) => {
    setLoading(true);

    const url = `${BASE_URL}/${id}`;

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
        toast.success("Desconto cancelado", {
          description: "O desconto foi cancelado com sucesso!",
        });

        return;
      }

      toast.error("Erro na atualização do desconto", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na atualização do desconto", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getDiscountsByClient = async (clientId: number) => {
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
          setDiscountList(res);
          return;
        }

        toast.error("Erro na lista de descontos", {
          description: res.message,
        });
      }
    } catch (err) {
      toast.error("Falha na lista de descontos", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    discountList,
    setDiscountList,
    getDiscountsByClient,
    createDiscount,
    deleteDiscount,
  };
}
