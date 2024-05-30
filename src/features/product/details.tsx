import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductForm from "@/features/product/form";

export default function ProductDetails() {
  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center mx-auto">
        <Card className="xl:w-[600px] md:w-[600px] mb-12">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center">Produtos</h1>
          </CardHeader>
          <CardContent>
            <ProductForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
