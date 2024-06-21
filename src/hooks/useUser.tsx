import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserType, loadUserData } from "@/features/user/form";
import useFetcher from "@/lib/request";

export default function useUser() {
  const fetcher = useFetcher();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState<UserType[]>([]);
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

    const response = await fetcher.post("user", body);

    if (response) {
      setLoading(false);
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
    const response = await fetcher.put(url, body);

    if (response) {
      navigate(`/user`);
    }

    setLoading(false);
  };

  const getUser = async (userId: string | undefined) => {
    setLoading(true);

    if (userId) {
      const response = await fetcher.get(`user/${userId}`);

      if (response) {
        setCurrentData(response);
      }
    } else {
      setCurrentData(loadUserData());
    }

    setLoading(false);
  };

  const getUsers = async () => {
    setLoading(true);

    const response = await fetcher.get("user");

    if (response) {
      setUsersList(response);
    }

    setLoading(false);
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
