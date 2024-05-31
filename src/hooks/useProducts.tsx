import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ProductType, loadProductData } from "@/features/product/form";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL + "/product";

export default function useProduct() {
  const headers = getHeader();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState<ProductType[]>([]);
  const [currentData, setCurrentData] = useState<ProductType>();

  const createProduct = async ({
    name,
    description,
    isActive,
    billingMethod,
    supplierId,
  }: ProductType) => {
    const body: BodyInit = JSON.stringify({
      name,
      description,
      billingMethod,
      supplierId: Number(supplierId),
      isActive: Boolean(isActive),
    });

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        return res;
      }

      toast.error("Erro na inclusão do produto", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na inclusão do produto", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    const url = `${BASE_URL}/${id}`;

    const params: RequestInit = {
      method: "DELETE",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        setCurrentData(res);
        return;
      }

      toast.error("Erro na exclusão do produto", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na exclusão do produto", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: number,
    { name, description, isActive, billingMethod, supplierId }: ProductType
  ) => {
    setLoading(true);

    const url = `${BASE_URL}/${id}`;

    const body: BodyInit = JSON.stringify({
      name,
      description,
      billingMethod,
      supplierId: Number(supplierId),
      isActive: Boolean(isActive),
    });

    const params: RequestInit = {
      method: "PUT",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        navigate(`/product`);
        return;
      }

      toast.error("Erro na atualização do produto", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na atualização do produto", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (productId: number) => {
    setLoading(true);
    const url = `${BASE_URL}/${productId}`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      if (!isNaN(productId)) {
        const response = await fetch(url, params);
        const res = await response.json();

        if (response.ok && res) {
          setCurrentData(res);
          return;
        }

        toast.error("Erro na lista de produtos", {
          description: res.message,
        });
      } else {
        setCurrentData(loadProductData());
      }
    } catch (err) {
      toast.error("Falha na lista de produtos", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    setLoading(true);

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(BASE_URL, params);
      const res = await response.json();

      if (response.ok && res) {
        setProductsList(res);
        return;
      }

      toast.error("Erro na lista de produtos", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de produtos", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    productsList,
    setProductsList,
    currentData,
    loading,
    getProduct,
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
  };
}
