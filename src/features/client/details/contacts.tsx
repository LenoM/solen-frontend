import { DataTable } from "@/components/dataTable";
import { columns } from "@/features/client/table/list-contacts";

export function Contacts(data: any) {
  return <DataTable columns={columns} data={data.contact} />;
}
