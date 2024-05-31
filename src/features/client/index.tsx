import { Clients } from "@/features/client/table/list-clients";
import { FindClient } from "@/features/client/forms/find";
import useClient from "@/hooks/useClient";

export default function Client() {
  const { getClient, clientsList } = useClient();

  return (
    <div className="p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Clientes</h1>
      <FindClient getClient={getClient} />

      <Clients clients={clientsList} showAddBtn={true} />
    </div>
  );
}
