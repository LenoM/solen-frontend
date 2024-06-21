import { useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LoadingSpinner } from "@/components/spinner";
import { DataTable } from "@/components/dataTable";
import { columns } from "@/features/user/table";
import UserForm from "@/features/user/form";
import useUser from "@/hooks/useUser";

export default function User() {
  const { usersList, loading, setUsersList, getUsers } = useUser();

  useEffect(() => {
    if (usersList.length === 0) {
      getUsers();
    }
  }, []);

  return (
    <div className="sx:p-0 md:p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Usuários</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
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

                <UserForm setUsersList={setUsersList} />
              </DialogContent>
            </Dialog>
          </div>

          <DataTable columns={columns} data={usersList} />
        </>
      )}
    </div>
  );
}
