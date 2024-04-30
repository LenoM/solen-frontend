import { DataTable } from "@/components/dataTable";
import { columns } from "@/features/client/table/list-invoices";

export function Invoices(data: any) {
  return <DataTable columns={columns} data={data.invoice} />;
}
