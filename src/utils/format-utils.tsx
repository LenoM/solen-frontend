import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
dayjs.extend(utc);

export const normalizePhoneNumber = (value: String | undefined) => {
  if (!value) return "";

  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})-?(\d{4})/, "$1-$2")
    .replace(/(-\d{4})(\d+?)/, "$1");
};

export const onlyNumbers = (value: String) => {
  return value.replace(/\D/g, "");
};

export const normalizeCnpjNumber = (value: String | undefined) => {
  if (!value) return "";

  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const formatCPF = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/[^\d]/g, "")
    .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
};

export const normalizeCepNumber = (value: String | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d{3})(\d{3})+?$/, "$1.$2-$3")
    .replace(/(-\d{3})(\d+?)/, "$1");
};

export const getNumbers = (value: string) => {
  return value.replace(/\D/g, "");
};

export const toDateValue = (dateString: Date) => {
  if (dateString) {
    return dayjs.utc(dateString).format("DD/MM/YYYY");
  }

  return "";
};

export const toMoneyValue = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
