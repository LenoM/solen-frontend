import { object, string, InferType, date } from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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

import { LoadingSpinner } from "@/components/spinner";
import { ErrorMessage } from "@/utils/error.enum";
import useReport from "@/hooks/useReport";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";

export const loadReportData = (data?: ReportType): ReportType => {
  return {
    id: data?.id || "",
    query: data?.query || "",
    description: data?.description || "",
    creationDate: data?.creationDate || undefined,
  };
};

const reportSchema = object({
  id: string(),
  description: string().required(ErrorMessage.required),
  query: string().required(ErrorMessage.required),
  creationDate: date(),
});

export type ReportType = InferType<typeof reportSchema>;

export default function ReportForm() {
  const { reportId } = useParams();
  const { loading, currentData, getReport, createReport, updateReport } = useReport();

  useMemo(async () => await getReport(reportId), [reportId]);

  const form = useForm({
    resolver: yupResolver(reportSchema),
    values: loadReportData(currentData),
  });

  const onSubmit = async () => {
    const newData = form.getValues();

    if (!reportId) {
      await createReport(newData);
    } else {
      await updateReport(reportId, newData);
    }
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-196">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
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
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione uma query válida"
                      className="resize-none"
                      {...field}
                    />
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
