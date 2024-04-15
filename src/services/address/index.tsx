import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/client";

export type AddressInputType = {
  cep: number;
  address: string;
  number?: number | null;
  complement?: string | null;
  addressCategory: "Residencial" | "Comercial" | "Cobranca";
  addressTypeId: number;
  districtId: number;
};

const createAddress = async (id: number, data: AddressInputType) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}/address`;

  const body: BodyInit = JSON.stringify({
    ...data,
  });

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const address = await fetch(url, params).then((resp) => resp.json());

  return address;
};

const deleteAddress = async (clientId: number, addressId: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${clientId}/address/${addressId}`;

  const params: RequestInit = {
    method: "DELETE",
    headers,
  };

  const address = await fetch(url, params).then((resp) => resp.json());

  return address;
};

export { createAddress, deleteAddress };
