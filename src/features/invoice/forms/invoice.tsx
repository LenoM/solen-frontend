import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon, MinusCircle, PlusCircle } from "lucide-react";
import { object, string, number, date, boolean, InferType, array } from "yup";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

import {
  toDateString,
  isOutOfRange,
  toMoneyString,
} from "@/utils/format-utils";
import { cn } from "@/lib/utils";
import useClient from "@/hooks/useClient";

import { DataTable } from "@/components/dataTable";
import type { ClientType } from "@/features/client/forms/personal";
import type { InvoiceItemType } from "@/features/invoice/forms/invoice-item";
import InvoiceItemForm, {
  invoiceProductBaseSchema,
} from "@/features/invoice/forms/invoice-item";

import useInvoice from "@/hooks/useInvoice";
import { ErrorMessage } from "@/utils/error.enum";

export const loadInvoiceData = (data?: InvoiceType): InvoiceType => {
  return {
    id: data?.id ?? 0,
    clientId: data?.clientId ?? 0,
    invoiceNumber: data?.invoiceNumber ?? "",
    isAgreement: data?.isAgreement ?? false,
    barCode: data?.barCode ?? "",
    originalDueDate: data?.originalDueDate ?? undefined,
    referenceDate: data?.referenceDate ?? new Date(),
    creationDate: data?.creationDate ?? undefined,
    paymentDate: data?.paymentDate ?? undefined,
    cancelDate: data?.cancelDate ?? undefined,
    deleteDate: data?.deleteDate ?? undefined,
    dueDate: data?.dueDate ?? new Date(),
    price: data?.price ?? 0,
    bankAccountId: data?.bankAccountId ?? 1,
    invoiceDetail: data?.invoiceDetail ?? [],
  };
};

export const invoiceBaseSchema = {
  id: number().nullable(),
  invoiceNumber: string(),
  isAgreement: boolean(),
  bankAccountId: number(),
  clientId: number(),
  barCode: string(),
  originalDueDate: date(),
  referenceDate: date().required(ErrorMessage.required),
  creationDate: date(),
  paymentDate: date(),
  cancelDate: date(),
  deleteDate: date(),
  dueDate: date().required(ErrorMessage.required),
  price: number().default(0),
};

const invoiceSchema = object().shape({
  ...invoiceBaseSchema,
  invoiceDetail: array(
    object().shape({
      ...invoiceProductBaseSchema,
    })
  ),
});

export type InvoiceType = InferType<typeof invoiceSchema>;

export default function InvoiceForm() {
  const { invoiceId } = useParams();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { createInvoice, getInvoice, currentData } = useInvoice();

  const [data, setData] = useState<InvoiceItemType[]>([]);
  const { clientsList, getClients } = useClient();

  useMemo(async () => await getClients(), []);
  useMemo(async () => await getInvoice(Number(invoiceId)), [invoiceId]);

  const form = useForm({
    resolver: yupResolver(invoiceSchema),
    values: loadInvoiceData(currentData),
    mode: "onBlur",
  });

  const selectedClientId = form.watch("clientId");

  useEffect(() => {
    if (currentData?.clientId !== selectedClientId) {
      setTotalPrice(0);
      setData([]);
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (currentData?.price && totalPrice == 0) {
      setTotalPrice(currentData?.price);
      setData(currentData.invoiceDetail ?? []);
    }
  }, [currentData]);

  const onSubmit = async () => {
    form.setValue("invoiceDetail", data);
    const newData: InvoiceType = form.getValues();
    await createInvoice(newData);
  };

  const addItem = (product: InvoiceItemType) => {
    setTotalPrice((prev: number) => Number(prev) + Number(product.price));
    setData((prev: InvoiceItemType[]) => {
      return [...prev, product];
    });
  };

  const InvoiceAction = () => {
    return (
      <div className="flex place-content-end gap-2 mb-3 mt-12">
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!selectedClientId}>
              <MinusCircle className="h-4 w-4 mr-2" />
              Descontos
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar descontos</DialogTitle>
            </DialogHeader>

            <InvoiceItemForm
              selectedClientId={selectedClientId}
              addItem={addItem}
              isDiscount={true}
            />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!selectedClientId}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Produtos
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar produtos</DialogTitle>
            </DialogHeader>

            <InvoiceItemForm
              selectedClientId={selectedClientId}
              addItem={addItem}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const InvoiceTotal = () => {
    return (
      <div className="flex flex-col mt-2 mb-2 text-right">
        <span className="font-black">Total: {toMoneyString(totalPrice)}</span>
      </div>
    );
  };

  const columns: ColumnDef<InvoiceItemType>[] = [
    {
      accessorKey: "clientId",
      header: "Cliente",
    },
    {
      accessorKey: "clientName",
      header: "Cliente",
      accessorFn: (data: InvoiceItemType) => data.client?.name ?? "",
    },
    {
      accessorKey: "productId",
      header: "Produto",
      accessorFn: (data: InvoiceItemType) =>
        data.discountType?.id ? "" : data.product.id,
    },
    {
      header: "Desconto",
      accessorFn: (data: InvoiceItemType) => data.discountType?.id,
    },
    {
      header: "Item",
      accessorFn: (data: InvoiceItemType) =>
        data.discountType?.description ?? data.product.name,
    },
    {
      accessorKey: "price",
      header: "Valor",
      accessorFn: (data: InvoiceItemType) => toMoneyString(data.price),
    },
  ];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="POST"
          id="invoice-form"
        >
          <div className="grid w-full items-center gap-4 xl:px-196">
            <div className="flex flex-col">
              <FormField
                name="clientId"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      value={value?.toString()}
                      defaultValue={value?.toString()}
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

            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="referenceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de referência</FormLabel>
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
                          selected={field.value}
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

            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de vencimento</FormLabel>
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
                          selected={field.value}
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
        </form>
      </Form>

      <InvoiceAction />

      <DataTable columns={columns} data={data} />

      <InvoiceTotal />

      <div className="flex flex-col mt-8">
        <Button form="invoice-form" type="submit">
          Salvar
        </Button>
      </div>
    </>
  );
}
