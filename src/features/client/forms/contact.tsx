import * as yup from "yup";
import validator from "validator";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

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
import { createContact, updateContact } from "@/services/contact";

export const loadContactData = (data?: ContactType): ContactType => {
  const { id } = useParams();

  return {
    id: data?.id || 0,
    clientId: data?.clientId || Number(id),
    value: data?.value || "",
    contactType: data?.contactType || "",
    isWhatsapp: data?.isWhatsapp || false,
  };
};

const customError = {
  required: "Campo obrigatório",
  equals: "Escolha um valor válido",
  invalid: "Formato inválido",
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

const contactSchema = yup.object().shape({
  id: yup.number().nullable(),
  clientId: yup.number().required(customError.required),
  contactType: yup
    .string()
    .nullable()
    .required(customError.required)
    .equals(contactTypeArray, customError.equals),
  isWhatsapp: yup.boolean().default(false),
  value: yup
    .string()
    .required(customError.required)
    .test({
      message: customError.invalid,
      test: (values, ctx) => {
        if (ctx.parent.contactType === "Email") {
          return validator.isEmail(values);
        } else {
          return validator.isMobilePhone(values, "pt-BR");
        }
      },
    }),
});

export type ContactType = yup.InferType<typeof contactSchema>;

export default function ContactForm(data: ContactType) {
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

  const onChangeValue = (evt: React.FormEvent<HTMLInputElement>) => {
    setValueInput(evt.currentTarget.value);
  };

  const onChangeType = (value: string) => {
    if (value !== "Celular") {
      form.setValue("isWhatsapp", false);
    }

    form.setValue("contactType", value);
    setCurrentType(value);
  };

  const onSubmit = async () => {
    try {
      let newData: ContactType = form.getValues();

      if (newData.id! > 0) {
        newData = await updateContact(newData);
      } else {
        newData = await createContact(newData);
      }

      if (!newData.id) {
        toast.error("Erro no cadastro", {
          description: "Ocorreu um erro ao tentar cadastrar o contato",
        });

        return;
      }

      toast.info("Contato salvo", {
        description: `O contato #${newData.id} foi salvo`,
      });
    } catch (error) {
      toast.error("Falha no cadastro", {
        description: "Ocorreu uma falha ao tentar cadastrar o contato",
      });
    }
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
