import * as yup from "yup";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createUser, updateUser } from "@/services/user";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "@/utils/error.enum";

export const loadUserData = (data?: UserType): UserType => {
  return {
    id: data?.id || "",
    name: data?.name || "",
    email: data?.email || "",
    isActive: data?.isActive === true,
    isChangePassword: true,
    passwordConfirmation: "",
    password: "",
  };
};

const userSchema = yup.object({
  id: yup.string(),
  name: yup.string().required(ErrorMessage.required),
  isActive: yup.boolean().default(false),
  isChangePassword: yup.boolean().default(true),
  email: yup
    .string()
    .email(ErrorMessage.invalidEmail)
    .required(ErrorMessage.required),
  password: yup.string().when("isChangePassword", {
    is: (value: number) => value,
    then: () =>
      yup
        .string()
        .required(ErrorMessage.required)
        .min(7, ErrorMessage.invalidLength),
  }),
  passwordConfirmation: yup.string().when("password", {
    is: (value: number) => value,
    then: () =>
      yup
        .string()
        .required(ErrorMessage.required)
        .min(7, ErrorMessage.invalidLength)
        .oneOf([yup.ref("password")], ErrorMessage.notEquals),
  }),
});

export type UserType = yup.InferType<typeof userSchema>;

interface UserProps {
  data: UserType;
  setData?: (user: UserType) => void;
}

export default function UserForm({ data, setData }: UserProps) {
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(userSchema),
    values: loadUserData(data),
  });

  const { id } = useParams();
  const showPasswordField = form.getValues("isChangePassword") || !id;

  const onSubmit = async () => {
    try {
      let newData: UserType = form.getValues();

      if (!!id) {
        newData = await updateUser(id, newData);
      } else {
        newData = await createUser(newData);
      }

      if (!newData.id) {
        toast.error("Erro no cadastro", {
          description: "Ocorreu um erro ao tentar cadastrar o usuário",
        });

        return;
      }

      if (setData) {
        setData(newData);
      }

      toast.info("Usuário salvo", {
        description: `O usuario foi salvo`,
      });

      navigate(`/user`);
    } catch (error) {
      toast.error("Falha no cadastro", {
        description: "Ocorreu uma falha ao tentar cadastrar o usuário",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-4 xl:px-196">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo?</FormLabel>
                    <FormDescription>
                      Usuários inativos não podem acessar o sistema
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      value={field.value?.toString()}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {!!id && (
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="isChangePassword"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Trocar a senha?
                      </FormLabel>
                      <FormDescription>
                        A nova senha entrará em vigou no próximo login ou após a
                        cessão atual expirar.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        value={field.value?.toString()}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {showPasswordField && (
            <>
              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme a senha</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          <div className="flex flex-col mt-8">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
