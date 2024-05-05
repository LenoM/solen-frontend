import { UserType } from "@/features/user/form";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/user";

const getUsers = async () => {
  const headers = getHeader();
  const url = BASE_URL;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const users = await fetch(url, params).then((resp) => resp.json());

  return users;
};

const getUser = async (id: string) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const user = await fetch(url, params).then((resp) => resp.json());

  return user;
};

const createUser = async ({ name, email, password }: UserType) => {
  const headers = getHeader();
  const url = BASE_URL;

  const body: BodyInit = JSON.stringify({
    name,
    email,
    password,
  });

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const user = await fetch(url, params).then((resp) => resp.json());

  return user;
};

const updateUser = async (id: string, { name, email, password }: UserType) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const body: BodyInit = JSON.stringify({
    name,
    email,
    password,
  });

  const params: RequestInit = {
    method: "PUT",
    headers,
    body,
  };

  const user = await fetch(url, params).then((resp) => resp.json());

  return user;
};

export { getUsers, getUser, createUser, updateUser };
