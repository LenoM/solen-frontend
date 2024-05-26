import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/discount";

const createDiscount = async (
  clientId: number,
  productId: number,
  price: number,
  description: string | undefined,
  initialDate: Date,
  finalDate: Date | null | undefined
) => {
  const headers = getHeader();
  const url = `${BASE_URL}/client/${clientId}`;

  const body: BodyInit = JSON.stringify({
    clientId,
    productId,
    price,
    description,
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

const deleteDiscount = async (id: number, finalDate: Date) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const body: BodyInit = JSON.stringify({
    finalDate,
  });

  const params: RequestInit = {
    method: "DELETE",
    headers,
    body,
  };

  const discount = await fetch(url, params).then((resp) => resp.json());

  return discount;
};

const getDiscountsByClient = async (clientId: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/client/${clientId}`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const discount = await fetch(url, params).then((resp) => resp.json());

  return discount;
};

export { createDiscount, deleteDiscount, getDiscountsByClient };
