import { object, string, number, array, boolean, InferType } from "yup";
import validator from "validator";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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

import { LoadingSpinner } from "@/components/spinner";
import { KinshipBadge, StatusBadge } from "@/features/client/status";
import { contactBaseSchema } from "@/features/client/forms/contact";
import { addressOutputSchema } from "@/features/client/forms/address";
import { clientHistoryBaseSchema } from "@/features/client/table/list-history";
import { invoiceBaseSchema } from "@/features/invoice/forms/invoice";
import { ErrorMessage } from "@/utils/error.enum";
import { Entity } from "@/utils/utils";
import useCompany from "@/hooks/useCompany";
import useCategory from "@/hooks/useCategory";
import useClient from "@/hooks/useClient";

const loadClientData = (data?: any): ClientType => {
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
    contacts: data?.contacts || [],
    dependents: data?.dependents || [],
    invoices: data?.invoices || [],
    address: data?.address || [],
  };
};

const kinshipArray = [
  { id: "Conjuge", name: "Cônjuge" },
  { id: "Enteado", name: "Enteado" },
  { id: "Filho", name: "Filho" },
  { id: "Mae", name: "Mãe" },
  { id: "Pai", name: "Pai" },
];

const clientBaseSchema = {
  id: number().nullable(),
  name: string().required(ErrorMessage.required),
  socialName: string().required(ErrorMessage.required),
  isHolder: boolean().default(true),
  isActive: boolean().default(true),
  gender: string()
    .required(ErrorMessage.required)
    .equals(["Masculino", "Feminino"], ErrorMessage.equals),
  cpf: string().transform(formatCPF).required(ErrorMessage.required).length(14),
  rg: string()
    .required(ErrorMessage.required)
    .min(5, ErrorMessage.invalidRG)
    .max(12, ErrorMessage.invalidRG),
  birthday: string()
    .transform((value) => formatDate(toDateString(value)))
    .required(ErrorMessage.invalidDate)
    .length(10, ErrorMessage.invalidDate),
  referenceDate: string()
    .transform((value) => formatDate(toDateString(value)))
    .required(ErrorMessage.invalidDate)
    .length(10, ErrorMessage.invalidDate),
  motherName: string().required(ErrorMessage.required),
  fatherName: string().required(ErrorMessage.required),
};

const holderBaseSchema = {
  categoryId: string()
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () => string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () =>
        number()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .required(ErrorMessage.required)
          .min(1, ErrorMessage.equals),
    }),
  companyId: string()
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () => string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () =>
        number()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .required(ErrorMessage.required)
          .min(1, ErrorMessage.equals),
    }),
  holderId: string()
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () => string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () =>
        string()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .required(ErrorMessage.required)
          .min(1, ErrorMessage.equals),
    }),
  kinship: string()
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () => string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () => string().required(ErrorMessage.required),
    }),
  bondDate: string()
    .when("isHolder", {
      is: (value: boolean) => value === true,
      then: () => string().nullable(),
    })
    .when("isHolder", {
      is: (value: boolean) => value === false,
      then: () =>
        string()
          .transform((value) => formatDate(toDateString(value)))
          .required(ErrorMessage.invalidDate)
          .length(10, ErrorMessage.invalidDate),
    }),
};

const clientSchema = object().shape({
  ...clientBaseSchema,
  ...holderBaseSchema,
  dependents: array(
    object().shape({
      ...clientBaseSchema,
    })
  ),
  address: array(
    object().shape({
      ...addressOutputSchema,
    })
  ),
  contacts: array(
    object().shape({
      ...contactBaseSchema,
    })
  ),
  invoices: array(
    object().shape({
      ...invoiceBaseSchema,
    })
  ),
  clientHistory: array(
    object().shape({
      ...clientHistoryBaseSchema,
    })
  ),
});

export type ClientType = InferType<typeof clientSchema>;

export default function Personal() {
  const { companyList, getCompany } = useCompany();
  const { categoryList, getCategories } = useCategory();
  const {
    loading,
    clientsList,
    getClientByid,
    getClients,
    createClient,
    updateClient,
  } = useClient();

  const { clientId } = useParams();
  const { data } = getClientByid(Number(clientId));

  const form = useForm({
    resolver: yupResolver(clientSchema),
    values: loadClientData(data),
    mode: "onBlur",
  });

  const isClientHolder = form.watch("isHolder");

  const isLoading =
    loading ||
    companyList.length == 0 ||
    categoryList.length == 0 ||
    clientsList.length == 0;

  useMemo(async () => await getCompany(), []);
  useMemo(async () => await getCategories(), []);
  useMemo(async () => await getClients(), []);

  useEffect(() => {
    if (isClientHolder) {
      form.setValue("bondDate", "");
      form.setValue("kinship", "");
      form.setValue("holderId", "");
    } else {
      if (!clientsList) {
        form.setValue("holderId", "");
      }

      if (companyList) {
        form.setValue("companyId", "");
      }

      if (categoryList) {
        form.setValue("categoryId", "");
      }

      if (kinshipArray) {
        form.setValue("kinship", "");
      }
    }
  }, [isClientHolder]);

  const onChangeBirthdate = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const parsedDate = formatDate(input);
    form.clearErrors("birthday");
    form.setValue("birthday", parsedDate);
  };

  const onBlurBirthdate = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const parsedDate = toDateString(value);

    form.clearErrors("birthday");

    if (!parsedDate) {
      form.setError("birthday", { message: ErrorMessage.invalidDate });
      return;
    }
  };

  const onChangeBondDate = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const parsedDate = formatDate(input);
    form.clearErrors("bondDate");
    form.setValue("bondDate", parsedDate);
  };

  const onBlurBondDate = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const parsedDate = toDateString(value);

    form.clearErrors("bondDate");

    if (!parsedDate) {
      form.setError("bondDate", { message: ErrorMessage.invalidDate });
      return;
    }
  };

  const onChangeReferenceDate = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const parsedDate = formatDate(input);
    form.clearErrors("referenceDate");
    form.setValue("referenceDate", parsedDate);
  };

  const onBlurReferenceDate = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const parsedDate = toDateString(value);

    form.clearErrors("referenceDate");

    if (!parsedDate) {
      form.setError("referenceDate", { message: ErrorMessage.invalidDate });
      return;
    }
  };

  const onChangeCPF = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const cpf = formatCPF(input);
    form.setValue("cpf", cpf);
  };

  const onBlurCPF = (e: FormEvent<HTMLInputElement>) => {
    const input = getNumbers(e.currentTarget.value);

    const isValid = validator.isTaxID(input, "pt-BR");

    if (!isValid) {
      form.setError("cpf", { message: ErrorMessage.invalidCPF });
      return;
    }
    form.clearErrors("cpf");
  };

  const onSubmit = async () => {
    const newData: ClientType = form.getValues();
    if (Number(data?.id) > 0) {
      await updateClient({ ...newData });
    } else {
      await createClient({ ...newData });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-196">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="flex flex-row-reverse gap-4">
                {data?.isActive && <StatusBadge isActive={data.isActive} />}
                {data?.kinship && <KinshipBadge kinship={data.kinship} />}
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
                              <SelectItem value="Masculino">
                                Masculino
                              </SelectItem>
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

              {isClientHolder && categoryList && companyList && (
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
                              {categoryList.map((cat: Entity) => {
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
                              {companyList.map((comp: Entity) => {
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

              {!isClientHolder && clientsList && (
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
                                <SelectValue placeholder="Escolha o titular" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clientsList.map((ctt: ClientType) => {
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
                                value={field.value}
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

              {!data?.id && (
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
              )}

              <div className="flex flex-col mt-8">
                <Button type="submit">Salvar</Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
