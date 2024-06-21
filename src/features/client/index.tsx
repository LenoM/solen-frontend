import { object, string } from "yup";
import { Link } from "react-router-dom";
import { Search, PlusCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Clients } from "@/features/client/table/list-clients";
import useClient from "@/hooks/useClient";

const pathNewClient = `${window.origin}/client/add`;

const filterSchema = object({
  filter: string(),
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
  const { getFilterClient, getClient, loading } = useClient();
  const onSubmit = () => getClient(filter);

  getFilterClient(filter);

  return (
    <div className="sx:p-0 md:p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Clientes</h1>

      <div className="flex flex-col md:flex-row place-content-between">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-2 w-4/4 sm:w-full mb-2">
              <FormField
                control={form.control}
                name="filter"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button variant="default" type="submit">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 md:mr-2" />
                )}
                <span className="sr-only md:not-sr-only">Procurar</span>
              </Button>
            </div>
          </form>
        </Form>

        <Button asChild>
          <Link to={pathNewClient}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo
          </Link>
        </Button>
      </div>

      <Clients />
    </div>
  );
}
