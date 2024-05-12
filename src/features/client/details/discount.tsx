import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { DataTable } from "@/components/dataTable";
import { getDiscountsByClient } from "@/services/discount";
import { columns } from "@/features/client/table/list-discount";

export function Discounts() {
  const { id } = useParams();
  const [discounts, setDiscounts] = useState([]);
  
  useEffect(() => {
    getData(id);
  }, [id]);

  const getData = async (clientId: string | undefined) => {
    if (clientId) {
      const result = await getDiscountsByClient(Number(clientId));
      setDiscounts(result);
    }
  };

  return <DataTable columns={columns} data={discounts} />;
}
