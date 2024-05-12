import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { DataTable } from "@/components/dataTable";
import { getSignatureByClient } from "@/services/signature";
import { columns } from "@/features/client/table/list-signatures";

export function Signatures() {
  const { id } = useParams();
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    getData(id);
  }, [id]);

  const getData = async (clientId: string | undefined) => {
    if (clientId) {
      const result = await getSignatureByClient(Number(clientId));
      setSignatures(result);
    }
  };

  return <DataTable columns={columns} data={signatures} />;
}
