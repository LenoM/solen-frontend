import * as yup from "yup";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";

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

import { ErrorMessage } from "@/utils/error.enum";
import useSupplier from "@/hooks/useSupplier";
import useProduct from "@/hooks/useProducts";

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

type ProductFormProps = {
  setProductsList?: Dispatch<SetStateAction<ProductType[]>>;
};

export default function ProductForm({ setProductsList }: ProductFormProps) {
  const { productId } = useParams();
  const { currentData, getProduct, createProduct, updateProduct } =
    useProduct();
  const { suppliersList, getSuppliers } = useSupplier();
  useMemo(async () => await getProduct(Number(productId)), [productId]);
  useMemo(async () => await getSuppliers(), []);

  useEffect(() => {
    if (suppliersList.length > 0 && currentData?.supplierId) {
      form.setValue("supplierId", currentData.supplierId);
    } else {
      form.setValue("supplierId", "");
    }
  }, [suppliersList, currentData]);

  const form = useForm({
    resolver: yupResolver(productSchema),
    values: loadProductData(currentData),
    mode: "onChange",
  });

  const onSubmit = async () => {
    const newData: ProductType = form.getValues();

    if (!productId) {
      await createProduct(newData);
    } else {
      await updateProduct(Number(newData.id), newData);
      setProductsList &&
        setProductsList((prev: ProductType[]) => [...prev, newData]);
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
