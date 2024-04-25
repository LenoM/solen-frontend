import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
dayjs.extend(utc);

export const toInputValue = (dateString: Date) => {
  return dayjs.utc(dateString).format("DD/MM/YYYY");
};
