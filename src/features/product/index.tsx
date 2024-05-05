import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getProducts } from "@/services/product";
import { DataTable } from "@/components/dataTable";
import { columns } from "@/features/product/table";
import ProductForm, { loadProductData } from "@/features/product/form";

export default function Product() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const result = await getProducts();
    setData(result);
  };

  return (
    <div className="p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Produtos</h1>
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

            <ProductForm {...loadProductData()} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
