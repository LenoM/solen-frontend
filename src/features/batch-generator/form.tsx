import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { object, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { LoadingSpinner } from "@/components/spinner";
import useCompany from "@/hooks/useCompany";
import useInvoice from "@/hooks/useInvoice";
import useProduct from "@/hooks/useProducts";
import useCategory from "@/hooks/useCategory";

import { toDateString, isOutOfRange } from "@/utils/format-utils";
import { ErrorMessage } from "@/utils/error.enum";
import { Entity } from "@/utils/utils";
import { cn } from "@/lib/utils";

import type { ProductType } from "@/features/product/form";

const loadData = (): BatchFilterType => {
  return {
    categoryId: -1,
    productId: -1,
    companyId: -1,
    bankAccountId: 1,
    clientId: 0,
    invoiceId: 0,
    referenceDate: new Date(),
    dueDate: new Date(),
  };
};

const invoiceFilterSchema = object().shape({
  invoiceId: number().transform((value) => (Number.isNaN(value) ? "" : value)),
  bankAccountId: number().nullable(),
  categoryId: number().nullable(),
  productId: number().nullable(),
  clientId: number().nullable(),
  companyId: number().nullable(),
  referenceDate: date().required(ErrorMessage.required),
  dueDate: date().required(ErrorMessage.required),
});

export type BatchFilterType = InferType<typeof invoiceFilterSchema>;

export default function InvoiceParam() {
  const { loading, createManyInvoice } = useInvoice();
  const { getCompany, companyList } = useCompany();
  const { getProducts, productsList } = useProduct();
  const { getCategories, categoryList } = useCategory();

  const isLoading =
    loading ||
    companyList.length === 0 ||
    productsList.length === 0 ||
    categoryList.length === 0;

  const form = useForm({
    resolver: yupResolver(invoiceFilterSchema),
    defaultValues: loadData(),
  });

  const handleSubmit = async () => {
    const newData = form.getValues();
    await createManyInvoice(newData);
  };

  useMemo(async () => await getCompany(), []);
  useMemo(async () => await getProducts(), []);
  useMemo(async () => await getCategories(), []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-196">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="flex flex-col">
                <FormField
                  name="categoryId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="category">
                            <SelectValue placeholder="Escolha a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="cat-empty" value="-1">
                            Todas as categorias
                          </SelectItem>

                          {categoryList.map((cat: Entity) => {
                            return (
                              <SelectItem
                                key={`cat-${cat.id}`}
                                value={cat.id.toString()}
                              >
                                {cat.description}
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

              <div className="flex flex-col">
                <FormField
                  name="companyId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <Select
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="company">
                            <SelectValue placeholder="Escolha a empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="emp-empty" value="-1">
                            Todas as empresas
                          </SelectItem>
                          {companyList.map((comp: Entity) => {
                            return (
                              <SelectItem
                                key={`emp-${comp.id}`}
                                value={comp.id.toString()}
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

              <div className="flex flex-col">
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
                          <SelectTrigger aria-label="product">
                            <SelectValue placeholder="Escolha o produto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="prod-empty" value="-1">
                            Todos os produtos
                          </SelectItem>

                          {productsList.map((comp: ProductType) => {
                            return (
                              <SelectItem
                                key={`prod-${comp.id}`}
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

              <div className="flex flex-col">
                <FormField
                  name="bankAccountId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <Select
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="bank">
                            <SelectValue placeholder="Escolha o banco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="bank-empty" value="1">
                            Banco Itaú
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col">
                <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-6 mt-2">
                  <FormField
                    control={form.control}
                    name="referenceDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Referência</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  toDateString(field.value)
                                ) : (
                                  <span>Escolha a data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ?? undefined}
                              onSelect={field.onChange}
                              disabled={(date) => isOutOfRange(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Vencimento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  toDateString(field.value)
                                ) : (
                                  <span>Escolha a data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ?? undefined}
                              onSelect={field.onChange}
                              disabled={(date) => isOutOfRange(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col mb-4 mt-4">
                <Button type="submit">Filtrar</Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
