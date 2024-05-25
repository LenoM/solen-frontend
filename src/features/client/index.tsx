import { useState } from "react";
import { FindClient } from "@/features/client/forms/find";
import { Clients } from "@/features/client/table/list-clients";

export default function Client() {
  const [data, setData] = useState([]);

  return (
    <div className="p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Clientes</h1>
      <FindClient setData={setData} />

      <Clients data={data} isHolder={true} />
    </div>
  );
}
