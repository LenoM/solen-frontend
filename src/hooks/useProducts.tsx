import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ProductType, loadProductData } from "@/features/product/form";
import useFetcher from "@/lib/request";

export default function useProduct() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState<ProductType[]>([]);
  const [currentData, setCurrentData] = useState<ProductType>();

  const createProduct = async (data: ProductType) => {
    setLoading(true);

    const { name, description, isActive, billingMethod, supplierId } = data;

    const body: BodyInit = JSON.stringify({
      name,
      description,
      billingMethod,
      supplierId: Number(supplierId),
      isActive: Boolean(isActive),
    });

    const response = await fetcher.post("product", body);

    if (response) {
      setLoading(false);
      return response;
    }

    setLoading(false);
  };

  const deleteProduct = async (productId: number) => {
    setLoading(true);

    const url = `product/${productId}`;

    const response = await fetcher.del(url);

    if (response) {
      setCurrentData(response);
    }

    setLoading(false);
  };

  const updateProduct = async (productId: number, data: ProductType) => {
    setLoading(true);

    const { name, description, isActive, billingMethod, supplierId } = data;
    const url = `product/${productId}`;

    const body: BodyInit = JSON.stringify({
      name,
      description,
      billingMethod,
      supplierId: Number(supplierId),
      isActive: Boolean(isActive),
    });

    const response = await fetcher.put(url, body);

    if (response) {
      navigate(`/product`);
    }

    setLoading(false);
  };

  const getProduct = async (productId: number) => {
    setLoading(true);

    const url = `product/${productId}`;

    if (!isNaN(productId)) {
      const response = await fetcher.get(url);

      if (response) {
        setCurrentData(response);
      }
    } else {
      setCurrentData(loadProductData());
    }

    setLoading(false);
  };

  const getProducts = async () => {
    setLoading(true);

    const response = await fetcher.get("product");

    if (response) {
      setProductsList(response);
    }

    setLoading(false);
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
