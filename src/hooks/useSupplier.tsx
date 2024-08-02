import { useState } from "react";
import useFetcher from "@/lib/request";
import type { Entity } from "@/utils/utils";

export default function useSupplier() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);
  const [suppliersList, setSuppliersList] = useState<Entity[]>([]);

  const getSuppliers = async () => {
    setLoading(true);

    const response = await fetcher.get<Entity[]>("supplier");

    if (response) {
      setSuppliersList(response);
    }

    setLoading(false);
  };

  return { loading, suppliersList, getSuppliers };
}
