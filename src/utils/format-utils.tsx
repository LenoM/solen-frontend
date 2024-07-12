import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
dayjs.extend(utc);
dayjs.extend(customParseFormat);
const TIMEZONE_DAFAULT = -3;

export const normalizePhoneNumber = (value: string | undefined) => {
  if (!value) return "";

  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})-?(\d{4})/, "$1-$2")
    .replace(/(-\d{4})(\d+?)/, "$1");
};

export const onlyNumbers = (value: string) => {
  return value.replace(/\D/g, "");
};

export const normalizeCnpjNumber = (value: string | undefined) => {
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

export const formatDate = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/[^\d]/g, "")
    .replace(/^(\d{2})(\d{2})(\d{4})$/, "$1/$2/$3");
};

export const normalizeCepNumber = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d{3})(\d{3})+?$/, "$1.$2-$3")
    .replace(/(-\d{3})(\d+?)/, "$1");
};

export const getNumbers = (value: string) => {
  return value.replace(/\D/g, "");
};

// TODO: O valor (-90) deve vir da config do sistema (DB)
export const getMinDate = () => {
  return dayjs().add(-90, "D");
};
// TODO: O valor (90) deve vir da config do sistema (DB)
export const getMaxDate = () => {
  return dayjs().add(90, "D");
};

export const isOutOfRange = (date: Date) => {
  const currenteDate = dayjs(date);

  const bf = currenteDate.diff(getMinDate(), "M");
  const af = currenteDate.diff(getMaxDate(), "M");

  return af > 3 || bf < -3;
};

export const toDateValue = (
  dateString: Date | string | null
): Date | undefined => {
  if (!dateString) {
    return undefined;
  }

  const value = dayjs.utc(dateString, "DD/MM/YYYY", true).toDate();
  return value;
};

export const toDateString = (
  dateString: Date | string | null | undefined
): string | undefined => {
  if (!dateString) return undefined;

  if (dateString.toString().length > 10) {
    dateString = dayjs.utc(dateString).format("DD/MM/YYYY");
  } else {
    dateString = dayjs.utc(dateString, "DD/MM/YYYY", true).format("DD/MM/YYYY");
  }

  const isValid = dayjs(dateString, "DD/MM/YYYY", true).isValid();
  const result = isValid ? dateString : undefined;

  return result;
};

export const toDateTimeString = (
  dateString: Date | string | number | null | undefined
): string | undefined => {
  if (!dateString) return undefined;

  console.log("ini", dateString);
  dateString = dayjs
    .utc(dateString)
    .utcOffset(TIMEZONE_DAFAULT)
    .format("DD/MM/YYYY HH:mm:ss");

  const isValid = dayjs(dateString, "DD/MM/YYYY HH:mm:ss", true).isValid();
  const result = isValid ? dateString : undefined;

  return result;
};

export const toDateTimeValue = (
  dateString: Date | string | null
): Date | undefined => {
  if (!dateString) {
    return undefined;
  }

  const value = dayjs.utc(dateString, "DD/MM/YYYY HH:mm", true).toDate();
  return value;
};

export const toMoneyString = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
