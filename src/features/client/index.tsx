import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/dataTable";
import { FindClient } from "@/features/client/forms/find";
import { columns } from "@/features/client/table/list-clients";

const pathNewClient = `${window.origin}/client/add`;

export default function Client() {
  const [data, setData] = useState([]);

  return (
    <div className="p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Clientes</h1>
      <div className="flex items-center justify-between">
        <FindClient setData={setData} />

        <Link to={pathNewClient}>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
