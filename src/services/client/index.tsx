import { ClientType } from "@/features/client/forms/personal";
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

const updateClient = async ({
  id,
  name,
  socialName,
  gender,
  cpf,
  rg,
  birthday,
  fatherName,
  motherName,
  kinship,
}: ClientType) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const body: BodyInit = JSON.stringify({
    name,
    socialName,
    gender,
    cpf,
    rg,
    birthday,
    fatherName,
    motherName,
    kinship,
  });

  const params: RequestInit = {
    method: "PUT",
    headers,
    body,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

const createClient = async ({
  name,
  socialName,
  gender,
  cpf,
  rg,
  birthday,
  fatherName,
  motherName,
}: ClientType) => {
  const headers = getHeader();
  const url = `${BASE_URL}`;

  const body: BodyInit = JSON.stringify({
    name,
    socialName,
    gender,
    cpf,
    rg,
    birthday,
    fatherName,
    motherName,
  });

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

export { getClient, getClientByid, createClient, updateClient };
