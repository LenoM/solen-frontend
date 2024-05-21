import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserForm, { loadUserData } from "@/features/user/form";
import { getUser } from "@/services/user";

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
    <div className="relative">
      <div className="flex flex-col items-center justify-center mx-auto">
        <Card className="xl:w-[600px] md:w-[600px] mb-12">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center">Usuário</h1>
          </CardHeader>
          <CardContent>
            <UserForm data={loadUserData(data)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
