import { date, number, object, InferType, string } from "yup";
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
  crmStatus,
  crmOrigin,
  crmMotive,
  crmSubMotive,
  CrmType,
  CLOSE_STATUS,
} from "@/features/crm/crm-utils";
import { toDateTimeString, toDateTimeValue } from "@/utils/format-utils";
import { ErrorMessage } from "@/utils/error.enum";
import { cn } from "@/lib/utils";
import type { Entity } from "@/utils/utils";

export const crmBaseSchema = {
  id: number().default(0),
  type: string(),
  clientId: number(),
  creationDate: date(),
  userId: string().optional(),
  userIdForward: string().optional(),
  description: string().required(ErrorMessage.required),
};

export const crmAditionalSchema = {
  collectStatusId: string().optional(),
  returnDate: string().transform((value) => toDateTimeString(value)),
  statusId: string()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(ErrorMessage.required)
    .min(1, ErrorMessage.equals),
  originId: string()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(ErrorMessage.required)
    .min(1, ErrorMessage.min),
  motiveId: string()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(ErrorMessage.required)
    .min(1, ErrorMessage.equals),
  subMotiveId: string()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(ErrorMessage.required)
    .min(1, ErrorMessage.equals),
};

export const crmHistorySchema = object().shape({
  ...crmBaseSchema,
  ...crmAditionalSchema,
});

export type CrmHistoryType = InferType<typeof crmHistorySchema>;

export const loadCrmData = (data?: CrmHistoryType): CrmHistoryType => {
  return {
    id: data?.id || 0,
    creationDate: data?.creationDate || undefined,
    returnDate: data?.returnDate || undefined,
    description: data?.description || "",
    userIdForward: data?.userIdForward || "",
    statusId: data?.statusId || CLOSE_STATUS.toString(),
    originId: data?.originId || "",
    motiveId: data?.motiveId || "",
    subMotiveId: data?.subMotiveId || "",
    collectStatusId: data?.collectStatusId || "",
    clientId: data?.clientId || undefined,
    type: CrmType.Service,
  };
};

type CrmFormProps = {
  disabled: boolean;
  data: CrmHistoryType;
  onSubmit: (newData: CrmHistoryType) => void;
};

export default function CrmForm({
  disabled = false,
  data,
  onSubmit,
}: CrmFormProps) {
  const isLoading = false;

  const form = useForm({
    resolver: yupResolver(crmHistorySchema),
    values: loadCrmData(data),
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
            {crmOrigin && (
              <div className="flex flex-col mb-2">
                <FormField
                  name="originId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Origem</FormLabel>
                      <Select
                        disabled={disabled}
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="origin">
                            <SelectValue placeholder="Escolha a origem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {crmOrigin.map((comp: Entity) => {
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

            {crmStatus && (
              <div className="flex flex-col mb-2">
                <FormField
                  name="statusId"
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
                          <SelectTrigger aria-label="status">
                            <SelectValue placeholder="Escolha o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {crmStatus.map((comp: Entity) => {
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

            {crmMotive && (
              <div className="flex flex-col mb-2">
                <FormField
                  name="motiveId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Motivo</FormLabel>
                      <Select
                        disabled={disabled}
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="motive">
                            <SelectValue placeholder="Escolha o motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {crmMotive.map((comp: Entity) => {
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

            {crmSubMotive && (
              <div className="flex flex-col mb-2">
                <FormField
                  name="subMotiveId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Sub Motivo</FormLabel>
                      <Select
                        disabled={disabled}
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="sub motive">
                            <SelectValue placeholder="Escolha o sub motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {crmSubMotive.map((comp: Entity) => {
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
