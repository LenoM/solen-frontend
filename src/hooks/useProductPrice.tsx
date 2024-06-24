import { toast } from "sonner";
import { useState } from "react";

import type { SignatureType } from "@/features/client/forms/signature";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

export default function useProductPrice() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);

  const createProductPrice = async (
    productId: number,
    clientId: number,
    price: number,
    initialDate: Date,
    finalDate: Date | null | undefined
  ) => {
    setLoading(true);

    const body: BodyInit = JSON.stringify({
      productId,
      clientId,
      price,
      initialDate,
      finalDate,
    });
    const response = await fetcher.post("product-price", body);

    if (response) {
      queryClient.setQueryData(
        ["getSignatureByClient", { clientId: clientId }],
        (prev: SignatureType[]) => {
          const signatureIndex = prev.findIndex(
            (sig) => Number(sig.productId) === productId
          );

          const newSig = {
            ...prev[signatureIndex],
            price: response.price,
          };

          const sigArray = [
            ...prev.slice(0, signatureIndex),
            newSig,
            ...prev.slice(signatureIndex + 1),
          ];

          toast.success("Preço configurado", {
            description: "O preço foi configurado com sucesso",
          });

          return sigArray;
        }
      );
    }

    setLoading(false);
  };

  return {
    loading,
    createProductPrice,
  };
}
