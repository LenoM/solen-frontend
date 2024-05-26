import { SignatureType } from "@/features/client/forms/signature";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/signature";

const createSignature = async (
  clientId: number,
  productId: number,
  price: number,
  initialDate: Date,
  finalDate: Date | null | undefined
): Promise<SignatureType[]> => {
  const headers = getHeader();
  const url = `${BASE_URL}/client/${clientId}/product/${productId}`;

  const body: BodyInit = JSON.stringify({
    initialDate,
    finalDate,
  });

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const discount = await fetch(url, params).then((resp) => resp.json());

  return discount;
};

const getSignatureByClient = async (clientId: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/client/${clientId}`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const signature = await fetch(url, params).then((resp) => resp.json());

  return signature;
};

const deleteSignature = async (
  signatureId: number,
  finalDate: Date
): Promise<SignatureType[]> => {
  const headers = getHeader();
  const url = `${BASE_URL}/${signatureId}`;

  const body: BodyInit = JSON.stringify({
    finalDate,
  });

  const params: RequestInit = {
    method: "DELETE",
    headers,
    body,
  };

  const signature = await fetch(url, params).then((resp) => resp.json());

  return signature;
};

export { getSignatureByClient, deleteSignature, createSignature };
