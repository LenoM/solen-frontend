import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/client";

const getClient = async (input: string) => {
  const headers = getHeader();
  const url = `${BASE_URL}/filter/${input}`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

const getClientByid = async (id: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

export { getClient, getClientByid };
