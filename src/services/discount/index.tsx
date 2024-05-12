import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/discount";

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

export { deleteDiscount, getDiscountsByClient };
