import { object, string, number, date, InferType } from "yup";
import { useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";

import { toDateString } from "@/utils/format-utils";
import { DataTable } from "@/components/dataTable";
import useClient from "@/hooks/useClient";

export const clientHistoryBaseSchema = {
  id: number().nullable(),
  registrationDate: date(),
  referenceDate: date(),
  action: string(),
  reason: string(),
};

const clientHistorySchema = object().shape({
  ...clientHistoryBaseSchema,
});

export type ClientHistoryType = InferType<typeof clientHistorySchema>;

export default function ClientHistory() {
  const { clientId } = useParams();
  const { getClientByid } = useClient();
  const { data: client } = getClientByid(Number(clientId));

  const columns: ColumnDef<ClientHistoryType>[] = [
    {
      accessorKey: "id",
      header: "Número",
    },
    {
      accessorKey: "registrationDate",
      header: "Registro",
      accessorFn: (data: ClientHistoryType) =>
        toDateString(data.registrationDate),
    },
    {
      accessorKey: "referenceDate",
      header: "Referência",
      accessorFn: (data: ClientHistoryType) => toDateString(data.referenceDate),
    },
    {
      accessorKey: "action",
      header: "Ação",
    },
    {
      accessorKey: "reason",
      header: "Motivo",
    },
  ];

  return (
    <>
      {client?.clientHistory && (
        <DataTable columns={columns} data={client.clientHistory} />
      )}
    </>
  );
}
