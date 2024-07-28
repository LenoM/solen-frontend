import { object, string, number, array, boolean, InferType } from "yup";

import { contactBaseSchema } from "@/features/client/forms/contact";
import { addressOutputBaseSchema } from "@/features/client/forms/address";
import { clientHistoryBaseSchema } from "@/features/client/table/list-history";
import { crmAditionalSchema, crmBaseSchema } from "@/features/crm/crm-form";
import { invoiceBaseSchema } from "@/features/invoice/forms/invoice";

import { ErrorMessage } from "@/utils/error.enum";

import { formatCPF, formatDate, toDateString } from "@/utils/format-utils";

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

export const clientSchema = object().shape({
  ...clientBaseSchema,
  ...holderBaseSchema,
  dependents: array(
    object().shape({
      ...clientBaseSchema,
    })
  ),
  address: array(
    object().shape({
      ...addressOutputBaseSchema,
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
  crmHistory: array(
    object().shape({
      ...crmBaseSchema,
      ...crmAditionalSchema,
    })
  ),
});

export type ClientType = InferType<typeof clientSchema>;
