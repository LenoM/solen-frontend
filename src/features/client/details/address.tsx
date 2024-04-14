import { DataTable } from "@/components/dataTable";
import { columns } from "@/features/client/table/list-address";

export function Address(data: any) {
  return (
    <DataTable columns={columns} data={data.address} />
  );
}
