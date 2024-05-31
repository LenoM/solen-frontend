import * as yup from "yup";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const filterSchema = yup.object({
  filter: yup.string(),
});

type FilterType = yup.InferType<typeof filterSchema>;

type FindClientProps = {
  getClient: (input: string | undefined) => void;
};

export function FindClient({ getClient }: FindClientProps) {
  const form = useForm({
    resolver: yupResolver(filterSchema),
    defaultValues: {
      filter: "",
    },
  });

  const onSubmit = async ({ filter }: FilterType) => {
    getClient(filter);
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
