import { ClientType } from "@/features/client/forms/personal";
import { toDateValue } from "@/utils/format-utils";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/client";

const getClients = async () => {
  const headers = getHeader();
  const url = BASE_URL;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

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

const getFamily = async (id: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/family/${id}`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

const cancelClient = async (
  id: number,
  cancelDate: Date,
  reason: string | undefined
) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}/cancel`;

  const body: BodyInit = JSON.stringify({
    cancelDate,
    reason,
  });

  const params: RequestInit = {
    method: "PATCH",
    headers,
    body,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

const reactivateClient = async (
  id: number,
  reactivatedDate: Date,
  dependents?: number[] | undefined
) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}/reactivate`;

  const body: BodyInit = JSON.stringify({
    reactivatedDate,
    dependents,
  });

  const params: RequestInit = {
    method: "PATCH",
    headers,
    body,
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
  bondDate,
  referenceDate,
  fatherName,
  motherName,
  categoryId,
  companyId,
  holderId,
  kinship = "Titular",
}: ClientType) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const body: BodyInit = JSON.stringify({
    name,
    socialName,
    gender,
    cpf,
    rg,
    birthday: toDateValue(birthday),
    bondDate: bondDate ? toDateValue(bondDate) : null,
    referenceDate: referenceDate ? toDateValue(referenceDate) : null,
    fatherName,
    motherName,
    categoryId,
    companyId,
    holderId,
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
  bondDate,
  referenceDate,
  fatherName,
  motherName,
  categoryId,
  companyId,
  holderId,
  kinship = "Titular",
}: ClientType) => {
  const headers = getHeader();
  const url = BASE_URL;

  const body: BodyInit = JSON.stringify({
    name,
    socialName,
    gender,
    cpf,
    rg,
    birthday: toDateValue(birthday),
    bondDate: bondDate ? toDateValue(bondDate) : null,
    referenceDate: referenceDate ? toDateValue(referenceDate) : null,
    fatherName,
    motherName,
    categoryId,
    companyId,
    holderId,
    kinship,
  });

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const clients = await fetch(url, params).then((resp) => resp.json());

  return clients;
};

export {
  getClients,
  getClient,
  getFamily,
  getClientByid,
  createClient,
  updateClient,
  cancelClient,
  reactivateClient,
};
