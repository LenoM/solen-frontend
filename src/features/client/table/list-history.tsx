import * as yup from "yup";
import { useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";

import { toDateString } from "@/utils/format-utils";
import { DataTable } from "@/components/dataTable";
import useClient from "@/hooks/useClient";

export const clientHistoryBaseSchema = {
  id: yup.number().nullable(),
  registrationDate: yup.date(),
  referenceDate: yup.date(),
  action: yup.string(),
  reason: yup.string(),
};

const clientHistorySchema = yup.object().shape({
  ...clientHistoryBaseSchema,
});

export type ClientHistoryType = yup.InferType<typeof clientHistorySchema>;

export function ClientHistory() {
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
