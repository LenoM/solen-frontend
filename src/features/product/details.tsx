import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "@/services/product";
import ProductForm, { loadProductData } from "@/features/product/form";

export default function ProductDetails() {
  const { id } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    getData(id);
  }, [id]);

  const getData = async (id: string | undefined) => {
    if (id) {
      const result = await getProduct(Number(id));
      setData(result);
    }
  };

  return (
    <div className="p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Produtos</h1>

      <ProductForm {...loadProductData(data)} />
    </div>
  );
}
