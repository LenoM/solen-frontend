import * as yup from "yup";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { getClient } from "@/services/client";

const filterSchema = yup.object({
  filter: yup.string(),
});

const MIN_INPUT_LENGTH = 5;

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
      if (!filter || filter.length < MIN_INPUT_LENGTH) {
        toast.warning("Busca de clientes", {
          description: `Informe ao menos ${MIN_INPUT_LENGTH} caracteres`,
        });
        return;
      }
      if (filter) {
        const restult = await getClient(filter);
        setData(restult);
      }
    } catch (error: any) {
      toast.error("Falha na busca", {
        description: `Ocorreu uma falha ao procurar os clientes.`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row content-center float-left">
          <FormField
            control={form.control}
            name="filter"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Nome" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button variant="default" className="ml-1" type="submit">
            <Search className="h-4 w-4  md:mr-2" />
            <span className="sr-only md:not-sr-only">Procurar</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
