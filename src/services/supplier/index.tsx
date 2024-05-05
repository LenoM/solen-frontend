import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/supplier";

const getSuppliers = async () => {
  const headers = getHeader();
  const url = BASE_URL;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const suppliers = await fetch(url, params).then((resp) => resp.json());

  return suppliers;
};

export { getSuppliers };
