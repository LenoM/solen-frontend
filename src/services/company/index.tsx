import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/company";

const getCompanies = async () => {
  const headers = getHeader();
  const url = BASE_URL;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const companies = await fetch(url, params).then((resp) => resp.json());

  return companies;
};

export { getCompanies };
