import { useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LoadingSpinner } from "@/components/spinner";
import { DataTable } from "@/components/dataTable";
import { columns } from "@/features/product/table";
import ProductForm from "@/features/product/form";
import useProduct from "@/hooks/useProducts";

export default function Product() {
  const { loading, productsList, getProducts, setProductsList } = useProduct();

  useEffect(() => {
    if (productsList.length === 0) {
      getProducts();
    }
  }, []);

  return (
    <div className="sx:p-0 md:p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Produtos</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex place-content-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastro de Produtos</DialogTitle>
                </DialogHeader>

                <ProductForm setProductsList={setProductsList} />
              </DialogContent>
            </Dialog>
          </div>

          <DataTable columns={columns} data={productsList} />
        </>
      )}
    </div>
  );
}
