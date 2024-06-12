import { object, number, array, date, InferType } from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";

import { Checkbox } from "@/components/ui/checkbox";
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
import useClient from "@/hooks/useClient";

const reactivateSchema = object().shape({
  referenceDate: date().required(ErrorMessage.required),
  id: number().nullable(),
  clientId: number().optional(),
  dependents: array(),
});

export type ReativateType = InferType<typeof reactivateSchema>;

type ReactivateInput = {
  referenceId: number;
  isHolder: boolean;
  onSubmit: (param: ReativateType) => void;
};

export default function ReactivateForm({
  referenceId,
  isHolder,
  onSubmit,
}: ReactivateInput) {
  const { getFamily, clientsList } = useClient();

  const form = useForm({
    resolver: yupResolver(reactivateSchema),
  });

  useMemo(async () => await getFamily(referenceId), [referenceId]);

  const handleSubmit = () => {
    const newData = form.getValues();

    onSubmit({
      clientId: referenceId,
      referenceDate: newData.referenceDate,
      dependents: newData.dependents || [],
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

          {isHolder && (
            <FormField
              control={form.control}
              name="dependents"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Dependentes</FormLabel>
                    <FormDescription>Selecione os dependentes</FormDescription>
                  </div>
                  {clientsList
                    .filter((dp) => dp.kinship !== "Titular")
                    .map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="dependents"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...updatedValue,
                                        item.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        updatedValue.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.name} - {item.kinship}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex flex-col mb-4 mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
