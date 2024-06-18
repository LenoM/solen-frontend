import { object, number, InferType, string } from "yup";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MoneyInput from "@/components/input/money";
import type { ProductType } from "@/features/product/form";
import type { DiscountDataType } from "@/features/discount";
import type { ClientType } from "@/features/client/forms/personal";
import useDiscount from "@/hooks/useDiscount";
import useProduct from "@/hooks/useProducts";
import useClient from "@/hooks/useClient";
import { Entity } from "@/utils/utils";
import { ErrorMessage } from "@/utils/error.enum";

export const entityBaseSchema = {
  id: number().nullable(),
  name: string().nullable(),
  description: string().nullable(),
};

export const invoiceProductBaseSchema = {
  id: number().default(0),
  invoiceId: number().nullable(),
  discountId: number().nullable(),
  signatureId: number().nullable(),
  productPriceId: number().nullable(),
  discountTypeId: number().test(function test() {
    const ctx = this.options.context;

    if (ctx === undefined) {
      return true;
    } else {
      return !!ctx;
    }
  }),
  productId: number().required(ErrorMessage.required),
  clientId: number().required(ErrorMessage.required),
  price: number().default(0),
  discountType: object().shape({ ...entityBaseSchema }),
  product: object().shape({ ...entityBaseSchema }),
  client: object().shape({ ...entityBaseSchema }),
};

const invoiceProductSchema = object().shape({
  ...invoiceProductBaseSchema,
});

export type InvoiceItemType = InferType<typeof invoiceProductSchema>;

type InvoiceProductsProps = {
  isDiscount?: boolean;
  selectedClientId: number | undefined;
  addItem: (product: InvoiceItemType) => void;
};

export default function InvoiceItemForm({
  addItem,
  selectedClientId,
  isDiscount = false,
}: InvoiceProductsProps) {
  const { getDiscountsTypes, discountTypeList } = useDiscount();
  const { getProducts, productsList } = useProduct();
  const { getFamily, clientsList } = useClient();

  useMemo(async () => await getDiscountsTypes(), []);
  useMemo(async () => await getProducts(), []);
  useMemo(
    async () => await getFamily(Number(selectedClientId)),
    [selectedClientId]
  );

  const form = useForm({
    resolver: yupResolver(invoiceProductSchema),
    context: { isDiscount: isDiscount },
  });

  const onSubmit = () => {
    const newData: InvoiceItemType = form.getValues();
    const currentProduct = productsList.find((p) => p.id == newData.productId);
    const currentClient = clientsList.find((p) => p.id == newData.clientId);
    const currentDiscount = discountTypeList.find(
      (p: Entity) => p.id == newData.discountTypeId
    );

    newData.product = currentProduct ?? {};
    newData.client = currentClient ?? {};
    newData.discountType = currentDiscount ?? {};

    newData.discountId = 0;
    newData.signatureId = 0;
    newData.productPriceId = 0;

    if (currentDiscount && newData.discountTypeId) {
      newData.price *= -1;
    }

    addItem(newData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-2">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="flex flex-col mb-2">
                <FormField
                  name="clientId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha o titular" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientsList.map((ctt: ClientType) => {
                            return (
                              <SelectItem
                                key={`state-${ctt.id}`}
                                value={ctt.id!.toString()}
                              >
                                {ctt.name}
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

              <div className="flex flex-col mb-2">
                <FormField
                  name="productId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Produto</FormLabel>
                      <Select
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha o produto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productsList.map((comp: ProductType) => {
                            return (
                              <SelectItem
                                key={`comp-${comp.id}`}
                                value={comp.id!.toString()}
                              >
                                {comp.name}
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

              {isDiscount && (
                <div className="flex flex-col mb-2">
                  <FormField
                    name="discountTypeId"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel>Desconto</FormLabel>
                        <Select
                          value={value?.toString()}
                          onValueChange={onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de desconto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {discountTypeList.map((comp: DiscountDataType) => {
                              return (
                                <SelectItem
                                  key={`comp-${comp.id}`}
                                  value={comp.id!.toString()}
                                >
                                  {comp.description}
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

              <div className="flex flex-col mb-2">
                <MoneyInput
                  form={form}
                  label="Valor"
                  name="price"
                  placeholder="Valor do desconto"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-4 mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
