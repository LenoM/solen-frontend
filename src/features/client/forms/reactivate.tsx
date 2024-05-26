import * as yup from "yup";
import { toast } from "sonner";
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
import { toDateString } from "@/utils/format-utils";
import { useEffect, useState } from "react";
import { getFamily } from "@/services/client";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorMessage } from "@/utils/error.enum";
import { ClientType } from "@/features/client/forms/personal";

const reactivateSchema = yup.object().shape({
  referenceDate: yup.date().required(ErrorMessage.required),
  id: yup.number().nullable(),
  clientId: yup.number().optional(),
  dependents: yup.array(),
});

export type ReativateType = yup.InferType<typeof reactivateSchema>;

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
  const [dependents, setDependents] = useState<ClientType[]>([]);

  useEffect(() => {
    if (isHolder && dependents.length === 0) {
      loadDependentsData(referenceId);
    }
  }, [isHolder]);

  const form = useForm({
    resolver: yupResolver(reactivateSchema),
  });

  const handleSubmit = () => {
    const newData = form.getValues();
    onSubmit({
      clientId: referenceId,
      referenceDate: newData.referenceDate,
      dependents: newData.dependents || [],
    });
  };

  const loadDependentsData = async (clientId: number) => {
    const result = await getFamily(clientId);

    if (result.error) {
      toast.error("Erro na consulta", {
        description: `Não foi possivel listar os dependentes`,
      });
      return;
    }

    setDependents(result);
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
                  {dependents
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
