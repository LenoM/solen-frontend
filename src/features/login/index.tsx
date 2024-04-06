import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as authService from "../../services/auth";

const loginSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(5),
});

type LoginType = yup.InferType<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }: LoginType) => {
    try {
      if (!email || !password) {
        setError("root", { message: "Informe o e-mail e a senha." });
        return;
      }

      await authService.doLogIn(email, password);

      if (authService.isLoggedIn() !== true) {
        setError("root", { message: "E-mail ou senha incorretos." });
        return;
      }

      navigate("/");
    } catch (error: any) {
      setError("root", { message: "Ocorreu um erro na tentativa de login." });
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-100 dark:border-gray-200">
          <div className="justify-self-center p-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm pb-12">
              <img
                src="/soberj.png"
                alt="Soberj Logo"
                width={900}
                height={900}
              />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
              action="#"
              method="POST"
            >
              <div>
                <input
                  {...register("email")}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs italic">
                    *Email incorreto
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Senha"
                  autoComplete="current-password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs italic">
                    *Senha incorreta
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Entrar
                </button>
              </div>

              <div>
                {errors.root && (
                  <p className="text-red-500 text-xs italic text-center">
                    *Login ou senha incorretos
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
