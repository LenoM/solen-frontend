import { object, string, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMemo } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/spinner";
import DropzoneControlled, { fileBaseSchema } from "@/components/dropzone";

import { entityBaseSchema } from "@/utils/utils";
import { ErrorMessage } from "@/utils/error.enum";
import useDocument from "@/hooks/useDocument";

const documentBaseSchema = {
  id: number().nullable(),
  creationDate: date().nullable(),
  description: string().optional(),
  clientId: number().nullable(),
  creatorUserId: string().nullable(),
  docTypeId: string()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(ErrorMessage.required)
    .min(1, ErrorMessage.equals),
  documentType: object()
    .shape({ ...entityBaseSchema })
    .optional(),
  documentUrl: string().nullable(),
  file: fileBaseSchema,
};

const documentSchema = object().shape({
  ...documentBaseSchema,
});

export type DocumentDataType = InferType<typeof documentSchema>;

export const loadDocumentData = (data?: DocumentDataType): DocumentDataType => {
  return {
    id: data?.id || 0,
    clientId: data?.clientId || 0,
    docTypeId: data?.docTypeId || "",
    creatorUserId: data?.creatorUserId || "",
    description: data?.description || "",
    documentUrl: data?.documentUrl || "",
    documentType: data?.documentType || undefined,
    file: data?.file || undefined,
  };
};

type DocumentFormProps = {
  data: DocumentDataType;
  onSubmit: (newData: DocumentDataType) => void;
};

export default function DocumentForm({ data, onSubmit }: DocumentFormProps) {
  const { loading, getDocumentType, documentTypeList } = useDocument();

  const form = useForm({
    resolver: yupResolver(documentSchema),
    values: loadDocumentData(data),
  });

  const isLoading = loading || documentTypeList.length === 0;

  useMemo(async () => await getDocumentType(), []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid w-full items-center gap-1">
            <div className="flex flex-col mb-2">
              <FormField
                name="docTypeId"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Tipo de documento</FormLabel>
                    <Select value={value?.toString()} onValueChange={onChange}>
                      <FormControl>
                        <SelectTrigger aria-label="documentTypeId">
                          <SelectValue placeholder="Escolha o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypeList.map((cat) => {
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

            <div className="flex flex-col mb-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Registre as observações..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col mb-2">
              <DropzoneControlled form={form} name="file" />
            </div>

            <div className="flex flex-col mb-4 mt-4">
              <Button type="submit">Salvar</Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
