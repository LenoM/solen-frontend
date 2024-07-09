import { object, string, boolean, InferType, ref } from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { LoadingSpinner } from "@/components/spinner";
import { ErrorMessage } from "@/utils/error.enum";
import useUser from "@/hooks/useUser";

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

const userSchema = object({
  id: string(),
  name: string().required(ErrorMessage.required),
  isActive: boolean().default(false),
  isChangePassword: boolean().default(true),
  email: string()
    .email(ErrorMessage.invalidEmail)
    .required(ErrorMessage.required),
  password: string().when("isChangePassword", {
    is: (value: number) => value,
    then: () =>
      string()
        .required(ErrorMessage.required)
        .min(7, ErrorMessage.invalidLength),
  }),
  passwordConfirmation: string().when("password", {
    is: (value: number) => value,
    then: () =>
      string()
        .required(ErrorMessage.required)
        .min(7, ErrorMessage.invalidLength)
        .oneOf([ref("password")], ErrorMessage.notEquals),
  }),
});

export type UserType = InferType<typeof userSchema>;

export default function UserForm() {
  const { userId } = useParams();

  const { loading, currentData, getUser, createUser, updateUser } = useUser();

  useMemo(async () => await getUser(userId), [userId]);

  const form = useForm({
    resolver: yupResolver(userSchema),
    values: loadUserData(currentData),
  });

  const showPasswordField = form.getValues("isChangePassword") || !userId;

  const onSubmit = async () => {
    const newData = form.getValues();

    if (!userId) {
      await createUser(newData);
    } else {
      await updateUser(userId, newData);
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

          {!!userId && (
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
