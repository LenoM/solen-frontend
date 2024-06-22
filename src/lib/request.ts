import { toast } from "sonner";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function useFetcher() {
  const headers = getHeader();

  const get = async (urlPath: string): Promise<any> => {
    try {
      const url = `${BASE_URL}/${urlPath}`;

      const params: RequestInit = {
        method: "GET",
        headers,
      };

      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        return res;
      }

      toast.error(`Erro na requisição`, {
        description: res.message,
      });
    } catch (err) {
      toast.error(`Falha na requisição`, {
        description: `${SERVER_ERROR_MESSAGE} /${urlPath}`,
      });
    }
  };

  const del = async (urlPath: string): Promise<any> => {
    try {
      const url = `${BASE_URL}/${urlPath}`;

      const params: RequestInit = {
        method: "DELETE",
        headers,
      };

      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        return res;
      }

      toast.error(`Erro na requisição`, {
        description: res.message,
      });
    } catch (err) {
      toast.error(`Falha na requisição`, {
        description: `${SERVER_ERROR_MESSAGE} /${urlPath}`,
      });
    }
  };

  const put = async (urlPath: string, body: BodyInit): Promise<any> => {
    try {
      const url = `${BASE_URL}/${urlPath}`;

      const params: RequestInit = {
        method: "PUT",
        headers,
        body,
      };

      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        return res;
      }

      toast.error(`Erro na requisição`, {
        description: res.message,
      });
    } catch (err) {
      toast.error(`Falha na requisição`, {
        description: `${SERVER_ERROR_MESSAGE}, PUT ${urlPath}`,
      });
    }
  };

  const post = async (urlPath: string, body: BodyInit): Promise<any> => {
    try {
      const url = `${BASE_URL}/${urlPath}`;

      const params: RequestInit = {
        method: "POST",
        headers,
        body,
      };

      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        return res;
      }

      toast.error(`Erro na requisição`, {
        description: res.message,
      });
    } catch (err) {
      toast.error(`Falha na requisição POST ${urlPath}`, {
        description: SERVER_ERROR_MESSAGE,
      });
    }
  };

  return {
    post,
    get,
    put,
    del,
  };
}
