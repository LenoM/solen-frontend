import { object, string, number, boolean, InferType } from "yup";
import validator from "validator";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

import { normalizePhoneNumber } from "@/utils/format-utils";
import { ErrorMessage } from "@/utils/error.enum";

export const loadContactData = (data?: ContactType): ContactType => {
  const { clientId } = useParams();

  return {
    id: data?.id || 0,
    clientId: data?.clientId || Number(clientId),
    value: data?.value || "",
    contactType: data?.contactType || "",
    isWhatsapp: data?.isWhatsapp || false,
  };
};

const contactTypeArray = [
  "Email",
  "Telefone",
  "Celular",
  "Comercial",
  "Recado",
];

const formatValue = (value: string, currentType: string) => {
  if (!currentType || currentType === "Email") {
    return value.trim();
  }
  return normalizePhoneNumber(value);
};

export const contactBaseSchema = {
  id: number().nullable(),
  clientId: number().required(ErrorMessage.required),
  contactType: string()
    .nullable()
    .required(ErrorMessage.required)
    .equals(contactTypeArray, ErrorMessage.equals),
  isWhatsapp: boolean().default(false),
  value: string()
    .required(ErrorMessage.required)
    .test({
      message: ErrorMessage.invalidContact,
      test: (values, ctx) => {
        if (ctx.parent.contactType === "Email") {
          return validator.isEmail(values);
        } else {
          return validator.isMobilePhone(values, "pt-BR");
        }
      },
    }),
};

const contactSchema = object().shape({
  ...contactBaseSchema,
});

export type ContactType = InferType<typeof contactSchema>;

type ContactFormProps = {
  data: ContactType;
  onSubmit: (newData: ContactType) => void;
};

export default function ContactForm({ data, onSubmit }: ContactFormProps) {
  const [currentType, setCurrentType] = useState("");
  const [formatedValue, setFormatedValue] = useState("");

  const form = useForm({
    resolver: yupResolver(contactSchema),
    values: loadContactData(data),
  });

  useEffect(() => {
    loadInitialData(data);
  }, [data]);

  const loadInitialData = (data: ContactType) => {
    if (data.contactType) {
      setCurrentType(data.contactType);
      setValueInput(data.value, data.contactType);
    }
  };

  const setValueInput = (value: string, contactType = currentType) => {
    value = formatValue(value, contactType);
    form.setValue("value", value);
    setFormatedValue(value);
  };

  const onChangeValue = (evt: FormEvent<HTMLInputElement>) => {
    setValueInput(evt.currentTarget.value);
  };

  const onChangeType = (value: string) => {
    if (value !== "Celular") {
      form.setValue("isWhatsapp", false);
    }

    form.setValue("contactType", value);
    setCurrentType(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-1">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <FormField
                name="contactType"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Tipo de Contato</FormLabel>
                    <Select
                      value={currentType}
                      onValueChange={(value) => onChangeType(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactTypeArray.map((ctt) => {
                          return (
                            <SelectItem key={`state-${ctt}`} value={ctt}>
                              {ctt}
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
          </div>

          <div className="flex flex-col mb-2">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={onChangeValue}
                      value={formatedValue}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {currentType === "Celular" && (
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="isWhatsapp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Cadastrado como whatsapp</FormLabel>
                      <FormDescription>
                        Esse telefone será usado para receber menssagem
                      </FormDescription>
                    </div>
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
