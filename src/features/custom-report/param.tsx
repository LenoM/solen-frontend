import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { toDateString, isOutOfRange } from "@/utils/format-utils";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { CustomInputType, getQueryParam } from "./utils";

import { ErrorMessage } from "@/utils/error.enum";
import useReport from "@/hooks/useReport";

type ReportParamProps = {
  reportId: string | undefined;
  query: string | undefined;
  option: "Print" | "Export";
};

export default function ReportParam({
  reportId,
  query,
  option,
}: ReportParamProps) {
  const [paramArray, setParamArray] = useState<CustomInputType[]>([]);

  const { printReport, exportReport } = useReport();

  const form = useForm();

  const CustomInput = ({ name, label, type }: CustomInputType) => {
    switch (type) {
      case "text":
        return (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "number":
        return (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} type={type} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "date":
        return (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          toDateString(field.value)
                        ) : (
                          <span>Escolha a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={(date: Date) => isOutOfRange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    try {
      const options = getQueryParam(query);

      if (options && options.length > 0) {
        const obj = options?.map((el: string) => {
          const stringParams = el.substring(8, el.length - 1);
          const res = JSON.parse(`{${stringParams}}`);
          return res;
        });

        form.clearErrors("query");

        if (obj && obj?.length > 0) {
          setParamArray(obj);
        }
      }
    } catch {
      form.setError("query", { message: ErrorMessage.invalidQuery });
    }
  }, [query]);

  const onSubmit = async () => {
    const queryData = form.getValues();

    if (option === "Export") {
      await exportReport(Number(reportId), queryData);
    } else {
      await printReport(Number(reportId), queryData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-196">
          <div className="flex flex-col space-y-2">
            {paramArray.map((el: CustomInputType) => {
              return (
                <div className="flex flex-col" key={el.name}>
                  <CustomInput {...el} key={el.name} />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col mt-8">
            <Button type="submit">Executar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
