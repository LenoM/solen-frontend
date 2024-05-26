import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductForm, { loadProductData } from "@/features/product/form";
import { getProduct } from "@/services/product";

export default function ProductDetails() {
  const { productId } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    getData(productId);
  }, [productId]);

  const getData = async (productId: string | undefined) => {
    if (productId) {
      const result = await getProduct(Number(productId));
      setData(result);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center mx-auto">
        <Card className="xl:w-[600px] md:w-[600px] mb-12">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center">Produtos</h1>
          </CardHeader>
          <CardContent>
            <ProductForm data={loadProductData(data)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
