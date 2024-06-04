import * as yup from "yup";
import { useForm } from "react-hook-form";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import MoneyInput from "@/components/input/money";
import { ErrorMessage } from "@/utils/error.enum";
import { isOutOfRange, toDateString } from "@/utils/format-utils";

const productPriceSchema = yup.object().shape({
  price: yup.string().required(ErrorMessage.required),
  productId: yup.number().optional(),
  clientId: yup.number().optional(),
  initialDate: yup.date().required(ErrorMessage.required),
  finalDate: yup
    .date()
    .nullable()
    .min(yup.ref("initialDate"), ErrorMessage.invalidMinDate),
});

export type ProductPriceType = yup.InferType<typeof productPriceSchema>;

type ProductPricelInput = {
  productId: number | undefined;
  onSubmit: (param: ProductPriceType) => void;
};

export default function ProductPrice({
  onSubmit,
  productId,
}: ProductPricelInput) {
  const form = useForm({
    resolver: yupResolver(productPriceSchema),
  });

  const handleSubmit = () => {
    const newData = form.getValues();

    onSubmit({
      initialDate: newData.initialDate,
      finalDate: newData.finalDate,
      productId: Number(productId),
      price: newData.price,
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
                    O valor será cobrado nos boletos gerados a partir desta data
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
                    O valor será cobrado nos boletos gerados até desta data
                    (Opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col mb-2">
            <MoneyInput
              form={form}
              label="Valor"
              name="price"
              placeholder="Valor do desconto"
            />
          </div>

          <div className="flex flex-col mb-4 mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
