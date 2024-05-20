import * as yup from "yup";
import validator from "validator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
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

import {
  formatCPF,
  formatDate,
  getNumbers,
  toDateString,
} from "@/utils/format-utils";
import { createClient, getClients, updateClient } from "@/services/client";
import { KinshipBadge, StatusBadge } from "@/features/client/status";
import { getCategories } from "@/services/category";
import { getCompanies } from "@/services/company";
import { Entity } from "@/utils/utils";

export const loadClientData = (data?: any): ClientType => {
  return {
    id: data?.id || 0,
    holderId: data?.holderId || "",
    isHolder: data?.kinship ? data?.kinship === "Titular" : true,
    isActive: !!data?.isActive,
    name: data?.name || "",
    categoryId: data?.categoryId || "",
    companyId: data?.companyId || "",
    socialName: data?.socialName || "",
    gender: data?.gender || "",
    cpf: formatCPF(data?.cpf) || "",
    rg: data?.rg || "",
    birthday: formatDate(toDateString(data?.birthday)) || "",
    referenceDate: formatDate(toDateString(data?.referenceDate)) || "",
    bondDate: formatDate(toDateString(data?.bondDate)) || "",
    motherName: data?.motherName || "",
    fatherName: data?.fatherName || "",
    kinship: data?.kinship || "",
  };
};

const customError = {
  required: "Campo obrigatório",
  equals: "Escolha um valor válido",
  invalidCPF: "CPF inválido",
  invalidRG: "RG inválido",
  invalidDate: "Data inválida",
};

const kinshipArray = [
  { id: "Conjuge", name: "Cônjuge" },
  { id: "Enteado", name: "Enteado" },
  { id: "Filho", name: "Filho" },
  { id: "Mae", name: "Mãe" },
  { id: "Pai", name: "Pai" },
];

const clientSchema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required(customError.required),
  socialName: yup.string().required(customError.required),
  isHolder: yup.boolean().default(true),
  isActive: yup.boolean().default(true),
  categoryId: yup
    .string()
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () => yup.string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () =>
        yup
          .number()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .required(customError.required)
          .min(1, customError.equals),
    }),
  companyId: yup
    .string()
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () => yup.string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () =>
        yup
          .number()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .required(customError.required)
          .min(1, customError.equals),
    }),
  holderId: yup
    .string()
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () => yup.string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () =>
        yup
          .string()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .required(customError.required)
          .min(1, customError.equals),
    }),
  kinship: yup
    .string()
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () => yup.string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () => yup.string().required(customError.required),
    }),
  gender: yup
    .string()
    .required(customError.required)
    .equals(["Masculino", "Feminino"], customError.equals),
  cpf: yup
    .string()
    .transform(formatCPF)
    .required(customError.required)
    .length(14),
  rg: yup
    .string()
    .required(customError.required)
    .min(5, customError.invalidRG)
    .max(12, customError.invalidRG),
  birthday: yup
    .string()
    .transform((value) => formatDate(toDateString(value)))
    .required(customError.invalidDate)
    .length(10, customError.invalidDate),
  referenceDate: yup
    .string()
    .transform((value) => formatDate(toDateString(value)))
    .required(customError.invalidDate)
    .length(10, customError.invalidDate),
  bondDate: yup
    .string()
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () => yup.string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () =>
        yup
          .string()
          .transform((value) => formatDate(toDateString(value)))
          .required(customError.invalidDate)
          .length(10, customError.invalidDate),
    }),
  motherName: yup.string().required(customError.required),
  fatherName: yup.string().required(customError.required),
});

export type ClientType = yup.InferType<typeof clientSchema>;

export default function Personal(data: ClientType) {
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(clientSchema),
    values: loadClientData(data),
    mode: "onBlur",
  });

  const [holderArray, setHolderArray] = useState<ClientType[]>();
  const [categoryArray, setCategoryArray] = useState<Entity[]>();
  const [companyArray, setCompanyArray] = useState<Entity[]>();
  const isClientHolder = form.watch("isHolder");

  useEffect(() => {
    if (isClientHolder) {
      form.setValue("bondDate", "");
      form.setValue("kinship", "");
      form.setValue("holderId", "");
    } else {
      if (!holderArray) {
        form.setValue("holderId", "");
        form.setValue("kinship", "");
      }

      if (companyArray) {
        form.setValue("companyId", "");
      }

      if (categoryArray) {
        form.setValue("categoryId", "");
      }
    }
  }, [isClientHolder]);

  useEffect(() => {
    if (!holderArray && !isClientHolder) {
      getClientList();
    }

    if (isClientHolder) {
      if (!categoryArray) {
        getCategoryList();
      }

      if (!companyArray) {
        getCompanyList();
      }
    }
  }, [isClientHolder]);

  const onChangeBirthdate = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const parsedDate = formatDate(input);
    form.clearErrors("birthday");
    form.setValue("birthday", parsedDate);
  };

  const onBlurBirthdate = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const parsedDate = toDateString(value);

    form.clearErrors("birthday");

    if (!parsedDate) {
      form.setError("birthday", { message: customError.invalidDate });
      return;
    }
  };

  const onChangeBondDate = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const parsedDate = formatDate(input);
    form.clearErrors("bondDate");
    form.setValue("bondDate", parsedDate);
  };

  const onBlurBondDate = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const parsedDate = toDateString(value);

    form.clearErrors("bondDate");

    if (!parsedDate) {
      form.setError("bondDate", { message: customError.invalidDate });
      return;
    }
  };

  const onChangeReferenceDate = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const parsedDate = formatDate(input);
    form.clearErrors("referenceDate");
    form.setValue("referenceDate", parsedDate);
  };

  const onBlurReferenceDate = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const parsedDate = toDateString(value);

    form.clearErrors("referenceDate");

    if (!parsedDate) {
      form.setError("referenceDate", { message: customError.invalidDate });
      return;
    }
  };

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
        response = await createClient({ ...newData });
      } else {
        response = await updateClient({ ...newData });
      }

      if (response?.id) {
        toast.info("Cadastro salvo", {
          description: `O cliente #${response.id} foi salvo`,
        });

        navigate(`/client/${response.id}`)
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

  const getClientList = async () => {
    const clients = await getClients();
    setHolderArray(clients);

    if (!data.isHolder) {
      form.setValue("holderId", data.holderId);
      form.setValue("kinship", data.kinship);
    }
  };

  const getCategoryList = async () => {
    const categories = await getCategories();
    setCategoryArray(categories);

    form.resetField("categoryId");
    if (data.categoryId) {
      form.setValue("categoryId", data.categoryId);
    }
  };

  const getCompanyList = async () => {
    const companies = await getCompanies();
    setCompanyArray(companies);

    form.resetField("companyId");
    if (data.companyId) {
      form.setValue("companyId", data.companyId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-196">
          {data?.id !== 0 && (
            <div className="flex flex-row-reverse gap-4">
              <StatusBadge {...data} />
              <KinshipBadge {...data} />
            </div>
          )}

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
              <div>
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
                            <SelectValue placeholder="Escolha o gênero" />
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

              <div>
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nascimento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={onChangeBirthdate}
                          onBlur={onBlurBirthdate}
                          maxLength={10}
                        />
                      </FormControl>
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

          <div className="flex flex-col space-y-2">
            <Controller
              control={form.control}
              name="isHolder"
              render={({ field: { onChange, value } }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Titular?</FormLabel>
                    <FormDescription>
                      Boletos são gerados apenas para titulares
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch onCheckedChange={onChange} checked={value} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {isClientHolder && categoryArray && companyArray && (
            <>
              <div className="flex flex-col">
                <FormField
                  name="categoryId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryArray.map((cat: Entity) => {
                            return (
                              <SelectItem
                                key={`cat-${cat.id}`}
                                value={cat.id.toString()}
                              >
                                {cat.description}
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

              <div className="flex flex-col">
                <FormField
                  name="companyId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <Select
                        value={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha a empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companyArray.map((comp: Entity) => {
                            return (
                              <SelectItem
                                key={`comp-${comp.id}`}
                                value={comp.id.toString()}
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
            </>
          )}

          {!isClientHolder && holderArray && (
            <>
              <div className="flex flex-col">
                <FormField
                  name="holderId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Nome do titular</FormLabel>
                      <Select
                        value={value?.toString()}
                        defaultValue={value?.toString()}
                        onValueChange={onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Escolha o titular`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {holderArray.map((ctt: ClientType) => {
                            return (
                              <SelectItem
                                key={`state-${ctt.id}`}
                                value={ctt.id!.toString()}
                              >
                                {ctt.name}
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

              <div className="flex flex-col space-y-2">
                <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
                  <div>
                    <FormField
                      name="kinship"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parentesco</FormLabel>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Escolha o parentesco" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {kinshipArray.map((ks) => {
                                return (
                                  <SelectItem
                                    key={`kinship-${ks.id}`}
                                    value={ks.id}
                                  >
                                    {ks.name}
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

                  <div>
                    <FormField
                      control={form.control}
                      name="bondDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de vínculo</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={onChangeBondDate}
                              onBlur={onBlurBondDate}
                              maxLength={10}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col space-y-2">
            <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
              <div>
                <FormField
                  control={form.control}
                  name="referenceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de referência</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={onChangeReferenceDate}
                          onBlur={onBlurReferenceDate}
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-8">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
