import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UserForm, { UserType, loadUserData } from "@/features/user/form";
import { DataTable } from "@/components/dataTable";
import { columns } from "@/features/user/table";
import { getUsers } from "@/services/user";

export default function User() {
  const [data, setData] = useState<UserType[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const result = await getUsers();
    setData(result);
  };

  return (
    <div className="p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Usuários</h1>
      <div className="flex place-content-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Usuário</DialogTitle>
            </DialogHeader>

            <UserForm {...loadUserData()} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
