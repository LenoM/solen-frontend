import { object, number, date, InferType } from "yup";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { isOutOfRange, toDateString } from "@/utils/format-utils";
import { ErrorMessage } from "@/utils/error.enum";

const hiringSchema = object().shape({
  id: number().nullable(),
  referenceId: number().optional(),
  referenceDate: date().required(ErrorMessage.required),
});

export type HaringType = InferType<typeof hiringSchema>;

type HiringInput = {
  referenceId: number;
  onSubmit: (param: HaringType) => void;
};

export default function HiringForm({ referenceId, onSubmit }: HiringInput) {
  const form = useForm({
    resolver: yupResolver(hiringSchema),
  });

  const handleSubmit = () => {
    const newData = form.getValues();
    onSubmit({
      referenceId: referenceId,
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
                        disabled={(date) => isOutOfRange(date)}
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

          <div className="flex flex-col mb-4 mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
