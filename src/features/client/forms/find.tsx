import * as yup from "yup";
import { Search } from "lucide-react";
import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { getClient } from "@/services/client";

const filterSchema = yup.object({
  filter: yup.string().min(3, "Mínimo: 3 caracteres"),
});

type FilterType = yup.InferType<typeof filterSchema>;

type FindClientProps = {
  setData: (data: SetStateAction<never[]>) => void;
};

export function FindClient({ setData }: FindClientProps) {
  const form = useForm({
    resolver: yupResolver(filterSchema),
    defaultValues: {
      filter: "",
    },
  });

  const onSubmit = async ({ filter }: FilterType) => {
    try {
      if (filter) {
        const restult = await getClient(filter);
        setData(restult);
      }
    } catch (error: any) {
      form.setError("root", {
        message: "Ocorreu um erro na tentativa de busca.",
      });
    }
  };
  const { filter, root } = form?.formState?.errors;

  return (
    <Form {...form}>
      <form
        className="flex items-top gap-1"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="filter"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage>{filter?.message ?? root?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button variant="link" type="submit">
          <Search className="h-4 w-4 mr-2" />
          Procurar
        </Button>
      </form>
    </Form>
  );
}
