import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/invoice";

const printInvoice = async (data: number[]) => {
  const headers = getHeader();
  const url = `${BASE_URL}/print`;

  const body: BodyInit = JSON.stringify(data);

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  return await fetch(url, params).then(async (resp) => {
    if (!resp.ok) {
      return "";
    }
    return await resp.text();
  });
};

const sendInvoice = async (data: number[]) => {
  const headers = getHeader();
  const url = `${BASE_URL}/send`;

  const body: BodyInit = JSON.stringify(data);

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  return await fetch(url, params).then(async (resp) => {
    if (!resp.ok) {
      return false;
    }
    return true;
  });
};

export { printInvoice, sendInvoice };
