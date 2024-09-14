import { toast } from "sonner";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function useFetcher() {
  const headers = getHeader();

  const get = async <T>(urlPath: string): Promise<T | undefined> => {
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
    } catch {
      toast.error("Falha na requisição", {
        description: `${SERVER_ERROR_MESSAGE} GET /${urlPath}`,
      });
    }
  };

  const del = async <T>(
    urlPath: string,
    body?: BodyInit
  ): Promise<T | undefined> => {
    try {
      const url = `${BASE_URL}/${urlPath}`;

      const params: RequestInit = {
        method: "DELETE",
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
    } catch {
      toast.error("Falha na requisição", {
        description: `${SERVER_ERROR_MESSAGE} DELETE /${urlPath}`,
      });
    }
  };

  const put = async <T>(
    urlPath: string,
    body: BodyInit
  ): Promise<T | undefined> => {
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
    } catch {
      toast.error("Falha na requisição", {
        description: `${SERVER_ERROR_MESSAGE} PUT /${urlPath}`,
      });
    }
  };

  const post = async <T>(
    urlPath: string,
    body: BodyInit
  ): Promise<T | undefined> => {
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
    } catch {
      toast.error("Falha na requisição", {
        description: `${SERVER_ERROR_MESSAGE} POST /${urlPath}`,
      });
    }
  };

  const patch = async <T>(
    urlPath: string,
    body: BodyInit
  ): Promise<T | undefined> => {
    try {
      const url = `${BASE_URL}/${urlPath}`;

      const params: RequestInit = {
        method: "PATCH",
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
    } catch {
      toast.error("Falha na requisição", {
        description: `${SERVER_ERROR_MESSAGE} PATCH /${urlPath}`,
      });
    }
  };

  return {
    patch,
    post,
    get,
    put,
    del,
  };
}
