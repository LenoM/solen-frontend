import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { DiscountType } from "@/features/client/forms/discount";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

export default function useDiscount() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);
  const [discountTypeList, setDiscountTypeList] = useState([]);

  const createDiscount = async (
    clientId: number,
    productId: number,
    discountTypeId: number,
    price: number,
    description: string | undefined,
    initialDate: Date,
    finalDate: Date | null | undefined
  ) => {
    setLoading(false);

    const url = `discount/client/${clientId}`;

    const body: BodyInit = JSON.stringify({
      clientId,
      productId,
      discountTypeId,
      price,
      description,
      initialDate,
      finalDate,
    });

    const response = await fetcher.post(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getDiscountsByClient", { clientId }],
        response
      );

      toast.success("Desconto adicionado", {
        description: "O desconto foi adicionado com sucesso!",
      });
    }

    setLoading(false);
  };

  const deleteDiscount = async (
    discountId: number,
    clientId: number,
    finalDate: Date
  ) => {
    setLoading(true);

    const url = `discount/${discountId}`;

    const body: BodyInit = JSON.stringify({
      finalDate,
    });

    const response = await fetcher.del(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getDiscountsByClient", { clientId }],
        response
      );

      toast.success("Desconto cancelado", {
        description: "O desconto foi cancelado com sucesso!",
      });
    }

    setLoading(false);
  };

  const getDiscountsByClient = (clientId: number) => {
    return useQuery<DiscountType[]>({
      queryKey: ["getDiscountsByClient", { clientId }],
      queryFn: () => retrieveDiscountsByClient(clientId),
      refetchOnMount: false,
    });
  };

  const retrieveDiscountsByClient = async (clientId: number) => {
    setLoading(true);

    const url = `discount/client/${clientId}`;

    if (!isNaN(clientId) && clientId > 0) {
      const response = await fetcher.get(url);

      if (response) {
        return response;
      }
    }

    setLoading(false);
  };

  const getDiscountsTypes = async () => {
    setLoading(true);
    const url = `discount/types`;

    const response = await fetcher.get(url);

    if (response) {
      setDiscountTypeList(response);
      setLoading(false);
      return response;
    }

    setLoading(false);
  };

  return {
    loading,
    getDiscountsByClient,
    getDiscountsTypes,
    discountTypeList,
    createDiscount,
    deleteDiscount,
  };
}
