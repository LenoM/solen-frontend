import { ProductType } from "@/features/product/form";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/product";

const deleteProduct = async (id: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const params: RequestInit = {
    method: "DELETE",
    headers,
  };

  const product = await fetch(url, params).then((resp) => resp.json());

  return product;
};

const getProducts = async () => {
  const headers = getHeader();
  const url = BASE_URL;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const product = await fetch(url, params).then((resp) => resp.json());

  return product;
};

const getProduct = async (id: number) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const params: RequestInit = {
    method: "GET",
    headers,
  };

  const product = await fetch(url, params).then((resp) => resp.json());

  return product;
};

const updateProduct = async (
  id: number,
  { name, description, isActive, billingMethod, supplierId }: ProductType
) => {
  const headers = getHeader();
  const url = `${BASE_URL}/${id}`;

  const body: BodyInit = JSON.stringify({
    name,
    description,
    isActive,
    billingMethod,
    supplierId,
  });

  const params: RequestInit = {
    method: "PUT",
    headers,
    body,
  };

  const product = await fetch(url, params).then((resp) => resp.json());

  return product;
};

const createProduct = async ({
  name,
  description,
  isActive,
  billingMethod,
  supplierId,
}: ProductType) => {
  const headers = getHeader();
  const url = BASE_URL;

  const body: BodyInit = JSON.stringify({
    name,
    description,
    isActive,
    billingMethod,
    supplierId,
  });

  const params: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  const product = await fetch(url, params).then((resp) => resp.json());

  return product;
};

export { createProduct, updateProduct, deleteProduct, getProducts, getProduct };
