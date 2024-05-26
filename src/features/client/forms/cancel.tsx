import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon } from "lucide-react";

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

import { cn } from "@/lib/utils";
import { toDateString } from "@/utils/format-utils";

const customError = {
  required: "Campo obrigatório",
  equals: "Escolha um valor válido",
};

const reasonTypeArray = ["Debito", "Pedido", "Obito"];

const cancelSchema = yup.object().shape({
  id: yup.number().nullable(),
  referenceDate: yup.date().required(customError.required),
  reason: yup
    .string()
    .nullable()
    .required(customError.required)
    .equals(reasonTypeArray, customError.equals),
});

export type CancelType = yup.InferType<typeof cancelSchema>;

export type CancelParam = {
  reason: string;
  clientId: number;
  referenceDate: Date;
};

type CancelInput = {
  referenceId: number;
  onSubmit: (param: CancelParam) => void;
};

export default function CancelForm({ referenceId, onSubmit }: CancelInput) {
  const form = useForm({
    resolver: yupResolver(cancelSchema),
  });

  const handleSubmit = () => {
    const newData = form.getValues();

    onSubmit({
      reason: newData.reason,
      clientId: referenceId,
      referenceDate: newData.referenceDate,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} method="POST">
        <div className="grid w-full items-center gap-1">
          <div className="flex flex-col mb-2">
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
                        disabled={(date) =>
                          date > new Date("2025-12-31") ||
                          date < new Date("2023-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Essa data será usada para calcular o valor do prorrata
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col mb-2">
            <FormField
              name="reason"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <Select value={value} onValueChange={onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o motivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reasonTypeArray.map((stt) => {
                        return (
                          <SelectItem key={stt} value={stt}>
                            {stt}
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

          <div className="flex flex-col mb-4 mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
