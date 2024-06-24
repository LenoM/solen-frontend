import { useState } from "react";
import { Entity } from "@/utils/utils";
import useFetcher from "@/lib/request";

export default function useSupplier() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);
  const [suppliersList, setSuppliersList] = useState<Entity[]>([]);

  const getSuppliers = async () => {
    setLoading(true);

    const response = await fetcher.get("supplier");

    if (response) {
      setSuppliersList(response);
    }

    setLoading(false);
  };

  return { loading, suppliersList, getSuppliers };
}
