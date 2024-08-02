import { useState } from "react";
import useFetcher from "@/lib/request";
import type { Entity } from "@/utils/utils";

export default function useCompany() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);
  const [companyList, setCompanyList] = useState<Entity[]>([]);

  const getCompany = async () => {
    setLoading(true);

    const response = await fetcher.get<Entity[]>("company");
    if (response) {
      setCompanyList(response);
    }

    setLoading(false);
  };

  return { loading, companyList, getCompany };
}
