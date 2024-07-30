import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, number, boolean, InferType } from "yup";
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

import { LoadingSpinner } from "@/components/spinner";
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

const productSchema = object({
  id: number().nullable(),
  name: string().required(ErrorMessage.required),
  description: string().required(ErrorMessage.required),
  isActive: boolean(),
  supplierId: string()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(ErrorMessage.required)
    .min(1, ErrorMessage.equals),
  billingMethod: string()
    .nullable()
    .required(ErrorMessage.required)
    .equals(["Fix", "Age"], ErrorMessage.equals),
});

export type ProductType = InferType<typeof productSchema>;

type ProductFormProps = {
  setProductsList?: Dispatch<SetStateAction<ProductType[]>>;
};

export default function ProductForm({ setProductsList }: ProductFormProps) {
  const { productId } = useParams();
  const { loading, currentData, getProduct, createProduct, updateProduct } =
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
    const newData = form.getValues();

    if (!productId && newData) {
      const newProd = await createProduct(newData);

      if (newProd) {
        setProductsList &&
          setProductsList((prev: ProductType[]) => [...prev, newProd]);
      }
    } else {
      await updateProduct(Number(newData.id), newData);
    }
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
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
                    name="billingMethod"
                    value={value.toString()}
                    defaultValue={value}
                    onValueChange={onChange}
                  >
                    <FormControl>
                      <SelectTrigger aria-label="billing method">
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
                      name="supplierId"
                      value={value?.toString()}
                      defaultValue={value?.toString()}
                      onValueChange={onChange}
                    >
                      <FormControl>
                        <SelectTrigger aria-label="supplier">
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
                    <Switch
                      name="isActive"
                      onCheckedChange={onChange}
                      checked={value}
                      aria-label="is active"
                    />
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
