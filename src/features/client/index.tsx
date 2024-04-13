import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FindClient } from "./forms/find";
import { DataTable } from "./dataTable";
import { columns } from "./table";

export default function Client() {
  const [data, setData] = useState([]);

  return (
    <div className="p-6 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Clientes</h1>
      <div className="flex items-center justify-between">
        <FindClient setData={setData} />

        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo
        </Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
