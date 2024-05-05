import { AddressDataType } from "@/features/client/forms/address";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAddressByCEP = async (input: string) => {
  const headers = getHeader();

  input = input.replace(".", "").replace("-", "");

  const url = `${BASE_URL}/address/${input}`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const address = await fetch(url, params).then((resp) => resp.json());

  return address;
};

const getAddressType = async () => {
  const headers = getHeader();

  const url = `${BASE_URL}/address-type`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const addressType = await fetch(url, params).then((resp) => resp.json());

  return addressType;
};

const getStates = async () => {
  const headers = getHeader();

  const url = `${BASE_URL}/states`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const states = await fetch(url, params).then((resp) => resp.json());

  return states;
};

const getCity = async (stateId: string) => {
  const headers = getHeader();

  const url = `${BASE_URL}/state/${stateId}/city`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const states = await fetch(url, params).then((resp) => resp.json());

  return states;
};

const getDistrict = async (cityId: string) => {
  const headers = getHeader();

  const url = `${BASE_URL}/city/${cityId}/district`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const states = await fetch(url, params).then((resp) => resp.json());

  return states;
};

const createAddress = async (
  clientId: number,
  {
    cep,
    address,
    number,
    complement,
    addressCategory,
    addressType,
    district,
  }: AddressDataType
) => {
  const headers = getHeader();
  const url = `${BASE_URL}/client/${clientId}/address`;

  const body: BodyInit = JSON.stringify({
    cep,
    address,
    number: Number(number),
    complement,
    addressCategory,
    addressTypeId: Number(addressType),
    districtId: district,
  });

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const newAddress = await fetch(url, params).then((resp) => resp.json());

  return newAddress;
};

const updateAddress = async (
  clientId: number,
  {
    id,
    cep,
    address,
    number,
    complement,
    addressCategory,
    addressType,
    district,
  }: AddressDataType
) => {
  const headers = getHeader();
  const url = `${BASE_URL}/client/${clientId}/address/${id}`;

  const body: BodyInit = JSON.stringify({
    cep,
    address,
    number: Number(number),
    complement,
    addressCategory,
    addressTypeId: Number(addressType),
    districtId: district,
  });

  const params: RequestInit = {
    method: "PUT",
    headers,
    body,
  };

  const newAddress = await fetch(url, params).then((resp) => resp.json());

  return newAddress;
};

const deleteAddress = async (clientId: number, addressId: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/client/${clientId}/address/${addressId}`;

  const params: RequestInit = {
    method: "DELETE",
    headers,
  };

  const address = await fetch(url, params).then((resp) => resp.json());

  return address;
};

export {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddressByCEP,
  getAddressType,
  getStates,
  getCity,
  getDistrict,
};
