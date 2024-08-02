import { number, object, InferType, string } from "yup";
import { Calendar as CalendarIcon } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

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

import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import { TimePickerDemo } from "@/components/input/time-picker/time-picker";
import { LoadingSpinner } from "@/components/spinner";

import {
  CLOSE_STATUS,
  CrmType,
  crmCollectStatus,
} from "@/features/crm/crm-utils";
import { toDateTimeString, toDateTimeValue } from "@/utils/format-utils";
import { ErrorMessage } from "@/utils/error.enum";
import { cn } from "@/lib/utils";
import { CrmHistoryType, crmBaseSchema } from "./crm-form";
import type { Entity } from "@/utils/utils";

const crmAditionalSchema = {
  statusId: number(),
  originId: string().optional(),
  motiveId: string().optional(),
  subMotiveId: string().optional(),
  returnDate: string()
    .transform((value) => toDateTimeString(value))
    .required(ErrorMessage.invalidDate)
    .length(16, ErrorMessage.invalidDate),
  collectStatusId: string()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(ErrorMessage.required)
    .min(1, ErrorMessage.equals),
};

const crmHistorySchema = object().shape({
  ...crmBaseSchema,
  ...crmAditionalSchema,
});

export type CollectHistoryType = InferType<typeof crmHistorySchema>;

export const loadCollectionData = (
  data?: CollectHistoryType | CrmHistoryType
): CollectHistoryType => {
  return {
    id: data?.id || 0,
    returnDate: data?.returnDate || "",
    description: data?.description || "",
    collectStatusId: data?.collectStatusId || "",
    type: CrmType.Collect,
    statusId: CLOSE_STATUS,
  };
};

type CrmFormProps = {
  disabled: boolean;
  data: CollectHistoryType;
  onSubmit: (newData: CollectHistoryType) => void;
};

export default function CrmCollectForm({
  disabled = false,
  data,
  onSubmit,
}: CrmFormProps) {
  const isLoading = false;

  const form = useForm({
    resolver: yupResolver(crmHistorySchema),
    values: loadCollectionData(data),
  });

  const handleSubmit = () => {
    onSubmit(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} method="POST">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid w-full items-center gap-1">
            {crmCollectStatus && (
              <div className="flex flex-col mb-2">
                <FormField
                  name="collectStatusId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        disabled={disabled}
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="collect status">
                            <SelectValue placeholder="Escolha o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {crmCollectStatus.map((comp: Entity) => {
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

            <div className="flex flex-col mb-2">
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-left">Retorno</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            disabled={disabled}
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              toDateTimeString(field.value)
                            ) : (
                              <span>Escolha a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={toDateTimeValue(field.value)}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <TimePickerDemo
                            setDate={field.onChange}
                            date={toDateTimeValue(field.value)}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col mb-2">
              <FormField
                disabled={disabled}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o resumo da chamada"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!disabled && (
              <div className="flex flex-col mb-4 mt-4">
                <Button type="submit">Salvar</Button>
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
