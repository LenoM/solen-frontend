import * as yup from "yup";
import { useState } from "react";
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

import { cn } from "@/lib/utils";
import { toDateValue } from "@/utils/format-utils";

const customError = {
  required: "Campo obrigatório",
  equals: "Escolha um valor válido",
  invalid: "Formato inválido",
};

const reasonTypeArray = ["Debito", "Pedido", "Obito"];

const cancelSchema = yup.object().shape({
  id: yup.number().nullable(),
  referenceDate: yup.date().required(customError.required),
  reason: yup
    .string()
    .required(customError.required)
    .equals(reasonTypeArray, customError.equals),
});

export type CancelType = yup.InferType<typeof cancelSchema>;

type HiringInput = {
  referenceId: number;
  onSubmit: (id: number, referenceDate: Date) => void;
};

export default function HiringForm({
  referenceId,
  onSubmit,
}: HiringInput) {
  const [date, setDate] = useState<Date>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm({
    resolver: yupResolver(cancelSchema),
  });

  const handleSubmit = () => {
    onSubmit(referenceId, form.getValues('referenceDate'));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} method="POST">
        <div className="grid w-full items-center gap-1">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="referenceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de referência</FormLabel>
                    <Popover>
                      <div className="relative w-full">
                        <Input
                          type="string"
                          value={toDateValue(field.value)}
                          onChange={(e) => {
                            const parsedDate = new Date(e.target.value);
                            if (parsedDate.toString() === "Invalid Date") {
                              setErrorMessage("Invalid Date");
                              setDate(undefined);
                            } else {
                              setErrorMessage("");
                              setDate(parsedDate);
                            }
                          }}
                        />
                        {errorMessage !== "" && (
                          <div className="absolute text-red-400 text-sm">
                            {errorMessage}
                          </div>
                        )}
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                          </Button>
                        </PopoverTrigger>
                      </div>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={date}
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
