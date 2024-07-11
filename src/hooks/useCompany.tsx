import { useState } from "react";
import { Entity } from "@/utils/utils";
import useFetcher from "@/lib/request";

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
