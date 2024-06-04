import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { isOutOfRange, toDateString } from "@/utils/format-utils";
import { ErrorMessage } from "@/utils/error.enum";
import type { ProductType } from "@/features/product/form";
import useProduct from "@/hooks/useProducts";

const signatureSchema = yup.object().shape({
  id: yup.number().nullable(),
  price: yup.string().optional(),
  productId: yup.number().required(ErrorMessage.required),
  clientId: yup.number().optional(),
  initialDate: yup.date().required(ErrorMessage.required),
  finalDate: yup
    .date()
    .nullable()
    .min(yup.ref("initialDate"), ErrorMessage.invalidMinDate),
});

export type SignatureType = yup.InferType<typeof signatureSchema>;

type CancelInput = {
  onSubmit: (param: SignatureType) => void;
};

export default function SignatureForm({ onSubmit }: CancelInput) {
  const { getProducts, productsList } = useProduct();

  const form = useForm({
    resolver: yupResolver(signatureSchema),
  });

  useMemo(async () => await getProducts(), []);

  const handleSubmit = () => {
    const newData = form.getValues();

    onSubmit({
      productId: newData.productId,
      initialDate: newData.initialDate,
      finalDate: newData.finalDate,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} method="POST">
        <div className="grid w-full items-center gap-1">
          <div className="flex flex-col mb-2">
            <FormField
              control={form.control}
              name="initialDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data inicial</FormLabel>
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
                  <FormDescription>
                    O desconto será adicionado aos boletos gerados a partir
                    desta data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col mb-2">
            <FormField
              control={form.control}
              name="finalDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data final</FormLabel>
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
                  <FormDescription>
                    O desconto será adicionado aos boletos gerados até desta
                    data (Opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {productsList && (
            <div className="flex flex-col mb-2">
              <FormField
                name="productId"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <Select value={value?.toString()} onValueChange={onChange}>
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
          )}

          <div className="flex flex-col mb-4 mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
