const BASE_URL = import.meta.env.VITE_API_URL + "/client";

const getClient = async (input: string) => {
  const url = `${BASE_URL}/filter/${input}`;
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

const getClientByid = async (id: number) => {
  const url = `${BASE_URL}/${id}`;
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

export { getClient, getClientByid };