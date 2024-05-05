import * as yup from "yup";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { getSuppliers } from "@/services/supplier";
import { createProduct, updateProduct } from "@/services/product";

const customError = {
  required: "Campo obrigatório",
  equals: "Escolha um valor válido",
};

export const loadProductData = (data?: ProductType): ProductType => {
  return {
    id: data?.id || 0,
    name: data?.name || "",
    description: data?.description || "",
    isActive: data?.isActive || true,
    billingMethod: data?.billingMethod || "",
    supplierId: data?.supplierId || 0,
  };
};

const productSchema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required(customError.required),
  description: yup.string().required(customError.required),
  isActive: yup.boolean(),
  supplierId: yup.number().required(customError.required),
  billingMethod: yup
    .string()
    .required(customError.required)
    .equals(["Fix", "Age"], customError.equals),
});

type Supplier = {
  id: number;
  name: string;
};

export type ProductType = yup.InferType<typeof productSchema>;

export default function ProductForm(data?: ProductType) {
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const result = await getSuppliers();
    setSuppliersList(result);
  };

  const form = useForm({
    resolver: yupResolver(productSchema),
    values: loadProductData(data),
  });

  const onSubmit = async () => {
    try {
      let newData: ProductType = form.getValues();

      if (!!newData.id) {
        newData = await updateProduct(Number(newData.id), newData);
      } else {
        newData = await createProduct(newData);
      }

      if (!newData.id) {
        toast.error("Erro no cadastro", {
          description: "Ocorreu um erro ao tentar cadastrar o usuário",
        });

        return;
      }

      toast.info("Endereço salvo", {
        description: `O usuario foi cadastrado`,
      });
    } catch (error) {
      toast.error("Falha no cadastro", {
        description: "Ocorreu uma falha ao tentar cadastrar o usuário",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-196">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <FormField
              name="billingMethod"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo cobrança</FormLabel>
                  <Select
                    value={field.value.toString()}
                    defaultValue={field.value}
                    onValueChange={(value) => form.setValue("billingMethod", value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="Fix" value="Fix">
                        Valor fixo
                      </SelectItem>
                      <SelectItem key="Age" value="Age">
                        Valor por faixa etária
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <FormField
              name="supplierId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
                  <Select
                    value={field.value.toString() ?? ""}
                    defaultValue={field.value ?? ""}
                    onValueChange={(value) => form.setValue("supplierId", Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o fornecedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliersList.map((stt) => {
                        return (
                          <SelectItem
                            key={stt.id}
                            value={stt.id.toString()}
                          >
                            {stt.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Produto Ativo</FormLabel>
                    <FormDescription>
                      Produtos inativos não podem ser usados em algumas rotinas
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} value={field.value?.toString()} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col mt-8">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
