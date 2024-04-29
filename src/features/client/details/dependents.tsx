import { DataTable } from "@/components/dataTable";
import { columns } from "@/features/client/table/list-clients";

export function Dependents(data: any) {
  return <DataTable columns={columns} data={data.dependents} />;
}
