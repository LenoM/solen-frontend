import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUser } from "@/services/user";
import UserForm, { loadUserData } from "@/features/user/form";

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    getData(id);
  }, [id]);

  const getData = async (id: string | undefined) => {
    if (id) {
      const result = await getUser(id);
      setData(result);
    }
  };

  return (
    <div className="p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Usuário</h1>

      <UserForm {...loadUserData(data)} />
    </div>
  );
}
