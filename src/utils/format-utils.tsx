import {
  parse,
  format,
  addDays,
  differenceInCalendarDays,
  parseISO,
} from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const LIMIT_OF_DAYS = 91;
const DATE_FORMAT = "dd/MM/yyyy";
const DATE_TIME_FORMAT = "dd/MM/yyyy hh:mm";
const TIMEZONE = "America/Sao_Paulo";

export { ptBR } from "date-fns/locale"

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
  return addDays(new Date(), -LIMIT_OF_DAYS);
};
// TODO: O valor (90) deve vir da config do sistema (DB)
export const getMaxDate = () => {
  return addDays(new Date(), LIMIT_OF_DAYS);
};

export const isOutOfRange = (date: Date) => {
  if (!date) return false;

  const value = toDateTimeValue(new Date(date));

  if (!value) return false;

  const bf = differenceInCalendarDays(getMinDate(), value);
  const af = differenceInCalendarDays(getMaxDate(), value);

  return bf > -1 || af < -1;
};

export const toDateValue = (
  dateString: Date | string | null
): Date | undefined => {
  if (!dateString) return undefined;
  const value = parse(dateString?.toString(), DATE_FORMAT, new Date());
  return value;
};

export const toDateString = (
  dateString: Date | string | undefined | null
): string | undefined => {
  if (!dateString) return undefined;

  if (dateString.toString().length > 24) {
    const result = format(dateString.toString(), DATE_FORMAT);
    return result;
  } else {
    return format(
      parseISO(dateString.toString().replace("000Z", "")),
      DATE_FORMAT
    );
  }
};

export const toDateTimeString = (
  dateString: Date | string | number | null | undefined
): string | undefined => {
  if (!dateString) return undefined;
  
  if (dateString.toString().length > 24) {
    const result = format(dateString.toString(), DATE_TIME_FORMAT);
    console.log('111')
    return result;
  } else {
    console.log('222', )
    return format(
      fromZonedTime(dateString?.toString(), TIMEZONE),
      DATE_TIME_FORMAT
    );
  }

};

export const toDateTimeValue = (
  dateString: Date | string | number | null | undefined
): Date | undefined => {
  if (!dateString) return undefined;
  const value = fromZonedTime(dateString, TIMEZONE);
  return value;
};

export const toMoneyString = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
