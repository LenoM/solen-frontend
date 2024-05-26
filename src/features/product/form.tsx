import * as yup from "yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
import { ErrorMessage } from "@/utils/error.enum";
import { Entity } from "@/utils/utils";

export const loadProductData = (data?: ProductType): ProductType => {
  return {
    id: data?.id ?? 0,
    name: data?.name ?? "",
    description: data?.description ?? "",
    isActive: data?.isActive ?? true,
    billingMethod: data?.billingMethod ?? "",
    supplierId: data?.supplierId ?? "",
  };
};

const productSchema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required(ErrorMessage.required),
  description: yup.string().required(ErrorMessage.required),
  isActive: yup.boolean(),
  supplierId: yup
    .string()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(ErrorMessage.required)
    .min(1, ErrorMessage.equals),
  billingMethod: yup
    .string()
    .nullable()
    .required(ErrorMessage.required)
    .equals(["Fix", "Age"], ErrorMessage.equals),
});

export type ProductType = yup.InferType<typeof productSchema>;

interface ProductProps {
  data: ProductType;
  setData?: (product: ProductType) => void;
}

export default function ProductForm({ data, setData }: ProductProps) {
  const navigate = useNavigate();
  const [suppliersList, setSuppliersList] = useState<Entity[]>([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (suppliersList && data?.supplierId) {
      form.setValue("supplierId", data.supplierId);
    } else {
      form.setValue("supplierId", "");
    }
  }, [suppliersList]);

  const getData = async () => {
    if (suppliersList.length === 0) {
      const result = await getSuppliers();
      setSuppliersList(result);
    }
  };

  const form = useForm({
    resolver: yupResolver(productSchema),
    values: loadProductData(data),
    mode: "onChange",
  });

  const onSubmit = async () => {
    try {
      let newData: ProductType = form.getValues();

      if (newData.id) {
        newData = await updateProduct(Number(newData.id), newData);
      } else {
        newData = await createProduct(newData);
      }

      if (!newData.id) {
        toast.error("Erro no cadastro", {
          description: "Ocorreu um erro ao tentar cadastrar o produto",
        });

        return;
      }

      if (setData) {
        setData(newData);
      }

      toast.info("Produto salvo", {
        description: `O produto foi salvo`,
      });

      navigate(`/product`);
    } catch (error) {
      toast.error("Falha no cadastro", {
        description: "Ocorreu uma falha ao tentar cadastrar o produto",
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
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Tipo cobrança</FormLabel>
                  <Select
                    value={value.toString()}
                    defaultValue={value}
                    onValueChange={onChange}
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

          {suppliersList.length > 0 && (
            <div className="flex flex-col space-y-2">
              <FormField
                name="supplierId"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <Select
                        value={value?.toString()}
                        defaultValue={value?.toString()}
                        onValueChange={onChange}
                      >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliersList.map((stt) => {
                          return (
                            <SelectItem key={stt.id} value={stt.id.toString()}>
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
          )}

          <div className="flex flex-col space-y-2">
            <Controller
              control={form.control}
              name="isActive"
              render={({ field: { onChange, value } }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Produto Ativo?</FormLabel>
                    <FormDescription>
                      Produtos inativos não podem ser usados em algumas rotinas
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch onCheckedChange={onChange} checked={value} />
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
