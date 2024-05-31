import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserType, loadUserData } from "@/features/user/form";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/user";

export default function useUser() {
  const headers = getHeader();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [currentData, setCurrentData] = useState<UserType>();

  const createUser = async ({ name, email, password, isActive }: UserType) => {
    const body: BodyInit = JSON.stringify({
      name,
      email,
      password,
      isActive,
    });

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        console.log(res);

        return res;
      }

      toast.error("Erro na inclusão do usuário", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na inclusão do usuário", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (
    id: string,
    { name, email, password, isActive }: UserType
  ) => {
    setLoading(true);

    const url = `${BASE_URL}/${id}`;

    const body: BodyInit = JSON.stringify({
      name,
      email,
      password,
      isActive,
    });

    const params: RequestInit = {
      method: "PUT",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        navigate(`/user`);
        return;
      }

      toast.error("Erro na atualização do usuário", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na atualização do usuário", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (userId: string | undefined) => {
    setLoading(true);
    const url = `${BASE_URL}/${userId}`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      if (userId) {
        const response = await fetch(url, params);
        const res = await response.json();

        if (response.ok && res) {
          setCurrentData(res);
          return;
        }

        toast.error("Erro na lista de usuários", {
          description: res.message,
        });
      } else {
        setCurrentData(loadUserData());
      }
    } catch (err) {
      toast.error("Falha na lista de usuários", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    setLoading(true);

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        setUsersList(res);
        return;
      }

      toast.error("Erro na lista de usuários", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de usuários", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    usersList,
    setUsersList,
    currentData,
    loading,
    getUser,
    getUsers,
    createUser,
    updateUser,
  };
}
