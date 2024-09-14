import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import type { LoginType } from "@/features/login";
import { setToken } from "@/utils/local-storage-utils";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";

const url = import.meta.env.VITE_API_URL + "/auth/login";

const useLogin = () => {
  const navigate = useNavigate();

  const onLogin = async ({ email, password }: LoginType) => {
    const headers = { "Content-Type": "application/json" };

    const body: BodyInit = JSON.stringify({
      password,
      email,
    });

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res.access_token) {
        setToken(res.access_token);
        navigate("/");
        return;
      }

      toast.error("Erro no login", {
        description: res.message,
      });
    } catch {
      toast.error("Falha no login", {
        description: `${SERVER_ERROR_MESSAGE} /login`,
      });
    }
  };

  return {
    onLogin,
  };
};

export default useLogin;
