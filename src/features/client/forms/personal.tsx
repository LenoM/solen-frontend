import * as yup from "yup";
import validator from "validator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

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
import { formatCPF, getNumbers, toDateValue } from "@/utils/format-utils";
import { createClient, updateClient } from "@/services/client";
import PersonalStatus from "@/features/client/status";

export const loadClientData = (data?: ClientType): ClientType => {
  return {
    id: data?.id || 0,
    name: data?.name || "",
    socialName: data?.socialName || "",
    gender: data?.gender || "",
    cpf: formatCPF(data?.cpf) || "",
    rg: data?.rg || "",
    birthday: data?.birthday || new Date(),
    motherName: data?.motherName || "",
    fatherName: data?.fatherName || "",
  };
};

const customError = {
  required: "Campo obrigatório",
  equals: "Escolha um valor válido",
  invalidCPF: "CPF inválido",
};

const clientSchema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required(customError.required),
  kinship: yup.string(),
  socialName: yup.string().required(customError.required),
  gender: yup
    .string()
    .required(customError.required)
    .equals(["Masculino", "Feminino"], customError.equals),
  cpf: yup
    .string()
    .transform(formatCPF)
    .required(customError.required)
    .length(14),
  rg: yup.string().required(customError.required).min(6).max(12),
  birthday: yup.date().required(customError.required),
  motherName: yup.string().required(customError.required),
  fatherName: yup.string().required(customError.required),
});

export type ClientType = yup.InferType<typeof clientSchema>;

export default function Personal(data: any) {
  const [date, setDate] = useState<Date>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm({
    resolver: yupResolver(clientSchema),
    values: loadClientData(data),
  });

  const onChangeCPF = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const cpf = formatCPF(input);
    form.setValue("cpf", cpf);
  };

  const onBlurCPF = (e: React.FormEvent<HTMLInputElement>) => {
    const input = getNumbers(e.currentTarget.value);

    const isValid = validator.isTaxID(input, "pt-BR");

    if (!isValid) {
      form.setError("cpf", { message: customError.invalidCPF });
      return;
    }
    form.clearErrors("cpf");
  };

  const onSubmit = async () => {
    try {
      const newData: ClientType = form.getValues();

      let response;

      if (data?.id == 0) {
        delete newData.id;
        response = await createClient({ ...newData });
      } else {
        response = await updateClient({ ...newData, kinship: "Titular" });
      }

      if (response?.id) {
        toast.info("Cadastro salvo", {
          description: `O cliente #${response.id} foi salvo`,
        });

        return;
      }

      toast.error("Erro no cadastro", {
        description: `Ocorreu um erro ao tentar cadastrar o cliente: ${response?.error}`,
      });
    } catch (error: any) {
      toast.error("Falha no cadastro", {
        description: "Ocorreu uma falha ao tentar cadastrar o cliente",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-96">
          <div className="text-right">
            <PersonalStatus {...data} />
          </div>
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="socialName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Social</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={onChangeCPF}
                        onBlur={onBlurCPF}
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
              <div className="">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nascimento</FormLabel>
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
                              <CalendarIcon className="" />
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
          </div>

          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Pai</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Mãe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col mt-8">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
