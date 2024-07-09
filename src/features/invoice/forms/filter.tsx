import { object, number, date, InferType } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { toDateString, isOutOfRange } from "@/utils/format-utils";
import useInvoice from "@/hooks/useInvoice";
import { cn } from "@/lib/utils";

const loadData = (): InvoiceFilterType => {
  return {
    categoryId: 0,
    productId: 0,
    clientId: 0,
    companyId: 0,
    invoiceId: 0,
    initialReferenceDate: undefined,
    finalReferenceDate: undefined,
    initialDueDate: undefined,
    finalDueDate: undefined,
  };
};

const invoiceFilterSchema = object().shape({
  invoiceId: number().transform((value) => (Number.isNaN(value) ? "" : value)),
  categoryId: number().nullable(),
  productId: number().nullable(),
  clientId: number().nullable(),
  companyId: number().nullable(),
  initialReferenceDate: date().nullable(),
  finalReferenceDate: date().nullable(),
  initialDueDate: date().nullable(),
  finalDueDate: date().nullable(),
});

export type InvoiceFilterType = InferType<typeof invoiceFilterSchema>;

export default function InvoiceFilter() {
  const { retrieveInvoices, loading } = useInvoice();
  const form = useForm({
    resolver: yupResolver(invoiceFilterSchema),
    defaultValues: loadData(),
  });

  const handleSubmit = async () => {
    const newData = form.getValues();
    await retrieveInvoices(newData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-196">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código ou numero</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
                  <FormField
                    control={form.control}
                    name="initialReferenceDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Referência inicial</FormLabel>
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
                    name="finalReferenceDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Referência final</FormLabel>
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

              <div className="flex flex-col space-y-2">
                <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
                  <FormField
                    control={form.control}
                    name="initialDueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Vencimento inicial</FormLabel>
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
                    name="finalDueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Vencimento final</FormLabel>
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
