import * as yup from "yup";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Clients } from "@/features/client/table/list-clients";
import useClient from "@/hooks/useClient";

const filterSchema = yup.object({
  filter: yup.string(),
});

export default function Client() {
  const form = useForm({
    resolver: yupResolver(filterSchema),
    mode: "onChange",
    defaultValues: {
      filter: "",
    },
  });

  const filter = form.watch("filter");
  const { getFilterClient } = useClient();
  const onSubmit = (e: Event) => e.preventDefault();

  getFilterClient(filter);

  return (
    <div className="sx:p-0 md:p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Clientes</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => onSubmit)}>
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

      <Clients />
    </div>
  );
}
