import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { UserType, loadUserData } from "@/features/user/form";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

export default function useUser() {
  const fetcher = useFetcher();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState<UserType>();

  const createUser = async (data: UserType) => {
    setLoading(true);

    const { name, email, password, isActive } = data;

    const body: BodyInit = JSON.stringify({
      name,
      email,
      password,
      isActive,
    });

    const response = await fetcher.post<UserType>("user", body);

    if (response) {
      setLoading(false);

      queryClient.setQueryData(["getUsers"], (prev: UserType[]) => {
        if (prev) {
          return [...prev, response];
        }
      });

      toast.success("Usuário adicionado", {
        description: "O usuário foi adicionado com sucesso",
      });

      return response;
    }

    setLoading(false);
  };

  const updateUser = async (userId: string, data: UserType) => {
    setLoading(true);

    const { name, email, password, isActive } = data;

    const body: BodyInit = JSON.stringify({
      name,
      email,
      password,
      isActive,
    });

    const url = `user/${userId}`;
    const response = await fetcher.put<UserType>(url, body);

    if (response) {
      toast.success("Usuário salvo", {
        description: "O usuário foi salvo com sucesso",
      });

      queryClient.setQueryData(["getUsers"], (prev: UserType[]) => {
        if (prev) {
          const userIndex = prev.findIndex((usu) => usu.id === userId);

          const users = [
            ...prev.slice(0, userIndex),
            response,
            ...prev.slice(userIndex + 1),
          ];

          setLoading(false);

          return users;
        }
      });

      navigate(`/user`);
    }

    setLoading(false);
  };

  const getUser = async (userId: string | undefined) => {
    setLoading(true);

    if (userId) {
      const response = await fetcher.get<UserType>(`user/${userId}`);

      if (response) {
        setCurrentData(response);
      }
    } else {
      setCurrentData(loadUserData());
    }

    setLoading(false);
  };

  const getUserList = () => {
    return useQuery<UserType[] | undefined>({
      queryKey: ["getUsers"],
      queryFn: () => getUsers(),
      refetchOnMount: false,
    });
  };

  const getUsers = async (): Promise<UserType[] | undefined> => {
    setLoading(true);

    const response = await fetcher.get<UserType[]>("user");

    if (response) {
      queryClient.setQueryData(["getUsers"], response);
      setLoading(false);
      return response;
    }
    setLoading(false);
  };

  return {
    currentData,
    loading,
    getUser,
    getUserList,
    createUser,
    updateUser,
  };
}
