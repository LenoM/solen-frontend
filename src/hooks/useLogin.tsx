import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { LoginType } from "@/features/login";

const url = import.meta.env.VITE_API_URL + "/auth/login";

const useLogin = () => {
  const navigate = useNavigate();

  const setToken = (email: string, token: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", email);
    localStorage.setItem("accessToken", token);
  };

  const isLoggedIn = (): boolean => {
    return Boolean(localStorage.getItem("isLoggedIn")) === true;
  };

  const isExpired = (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = jwtDecode(token);

      if (decoded && decoded.exp) {
        const expired = decoded.exp * 1000 < Date.now();

        if (!expired) {
          return false;
        }
      }
    }

    localStorage.clear();

    return true;
  };

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

      if (response.ok && res.email && res.access_token) {
        setToken(res.email, res.access_token);
        navigate("/");
        return;
      }

      toast.error("Erro no login", {
        description: res.message,
      });
    } catch (err: any) {
      toast.error("Falha no login", {
        description: SERVER_ERROR_MESSAGE,
      });
    }
  };

  return {
    onLogin,
    isExpired,
    isLoggedIn,
  };
};

export default useLogin;
