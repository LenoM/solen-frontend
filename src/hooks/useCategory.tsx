import { useState } from "react";

import { Entity } from "@/utils/utils";
import useFetcher from "@/lib/request";

export default function useCategory() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState<Entity[]>([]);

  const getCategories = async () => {
    setLoading(true);

    const response = await fetcher.get<Entity[]>("category");

    if (response) {
      setCategoryList(response);
    }

    setLoading(false);
  };

  return { loading, categoryList, getCategories };
}
