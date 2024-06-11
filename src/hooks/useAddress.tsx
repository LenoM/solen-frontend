import { toast } from "sonner";
import { useState } from "react";

import { AddressDataType } from "@/features/client/forms/address";
import { SERVER_ERROR_MESSAGE } from "@/utils/error.enum";
import { getHeader } from "@/utils/headers-utils";
import { queryClient } from "@/lib/react-query";
import { ClientType } from "@/features/client/forms/personal";

const BASE_URL = import.meta.env.VITE_API_URL;

type AddressAttr = {
  id: string;
  name: string;
  description: string;
  cityId: string;
  stateId: string;
};

export default function useAddress() {
  const headers = getHeader();
  const [loading, setLoading] = useState(true);

  /* TODO: usar react-query */
  const [cityList, setCityList] = useState<AddressAttr[]>([]);
  const [stateList, setStateList] = useState<AddressAttr[]>([]);
  const [districtList, setDistrictList] = useState<AddressAttr[]>([]);
  const [addressTypeList, setAddressTypeList] = useState<AddressAttr[]>([]);

  const [currentState, setCurrentState] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentDistrict, setCurrentDistrict] = useState("");

  const getAddressByCEP = async (input: string) => {
    setLoading(true);

    input = input.replace(".", "").replace("-", "");

    const url = `${BASE_URL}/address/${input}`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        const { district } = res[0];
        const { city } = district;
        const { state } = city;

        setCurrentState(state.id);

        /*** Set City */
        const hasCity = cityList.filter((el) => el.cityId === city.id).length;
        if (cityList.length === 0 || !hasCity) {
          await getCity(state.id);
          setCurrentCity(city.id);
        }

        /*** Set District */
        const hasDistrict = districtList.filter(
          (el) => el.id === district.id
        ).length;

        if (districtList.length === 0 || !hasDistrict) {
          await getDistrict(city.id);
          setCurrentDistrict(district.id);

          return;
        }

        toast.error("Erro na lista de endereços", {
          description: res.message,
        });
      }
    } catch (err) {
      toast.error("Falha na lista de endereços", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getAddressType = async () => {
    setLoading(true);

    const url = `${BASE_URL}/address-type`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        setAddressTypeList(res);
        return;
      }

      toast.error("Erro na lista de endereços", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de endereços", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStates = async () => {
    setLoading(true);

    const url = `${BASE_URL}/states`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        setStateList(res);
        return;
      }

      toast.error("Erro na lista de estados", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de estados", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getCity = async (stateId: string) => {
    setLoading(true);

    const url = `${BASE_URL}/state/${stateId}/city`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        setCityList(res);
        return;
      }

      toast.error("Erro na lista de cidades", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de cidades", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const getDistrict = async (cityId: string) => {
    setLoading(true);

    const url = `${BASE_URL}/city/${cityId}/district`;

    const params: RequestInit = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        setDistrictList(res);
        return;
      }

      toast.error("Erro na lista de bairros", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na lista de bairros", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (
    clientId: number,
    {
      cep,
      address,
      number,
      complement,
      addressCategory,
      addressType,
      district,
    }: AddressDataType
  ) => {
    const url = `${BASE_URL}/client/${clientId}/address`;

    const body: BodyInit = JSON.stringify({
      cep,
      address,
      number: Number(number),
      complement,
      addressCategory,
      addressTypeId: Number(addressType),
      districtId: district,
    });

    const params: RequestInit = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        queryClient.setQueryData(
          ["getClientById", { clientId }],
          (prev: ClientType) => {
            if (prev && prev.address) {
              return { ...prev, address: [...prev.address, res] };
            }
          }
        );

        toast.success("Endereço salvo", {
          description: `O endereço #${res.id} foi salvo`,
        });
        return res;
      }

      toast.error("Erro na cadastro do endereço", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na cadastro do cliente", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (
    clientId: number,
    {
      id,
      cep,
      address,
      number,
      complement,
      addressCategory,
      addressType,
      district,
    }: AddressDataType
  ) => {
    setLoading(true);

    const url = `${BASE_URL}/client/${clientId}/address/${id}`;

    const body: BodyInit = JSON.stringify({
      cep,
      address,
      number: Number(number),
      complement,
      addressCategory,
      addressTypeId: Number(addressType),
      districtId: district,
    });

    const params: RequestInit = {
      method: "PUT",
      headers,
      body,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        queryClient.setQueryData(
          ["getClientById", { clientId }],
          (prev: ClientType) => {
            prev.address = prev?.address
              ?.filter((d) => d.id !== res.id)
              .concat(res);
            return prev;
          }
        );

        toast.success("Endereço salvo", {
          description: `O endereço #${res.id} foi salvo`,
        });
        return res;
      }

      toast.error("Erro na atualização do endereço", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na atualização do endereço", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (clientId: number, addressId: number) => {
    const url = `${BASE_URL}/client/${clientId}/address/${addressId}`;

    const params: RequestInit = {
      method: "DELETE",
      headers,
    };

    try {
      const response = await fetch(url, params);
      const res = await response.json();

      if (response.ok && res) {
        queryClient.setQueryData(
          ["getClientById", { clientId }],
          (prev: ClientType) => {
            prev.address = prev?.address?.filter((d) => d.id !== res.id);
            return prev;
          }
        );

        toast.success("Endereço deletado", {
          description: `O endereço #${addressId} foi removido com sucesso!`,
        });

        return;
      }

      toast.error("Erro na exclusão do cliente", {
        description: res.message,
      });
    } catch (err) {
      toast.error("Falha na exclusão do cliente", {
        description: SERVER_ERROR_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    getAddressByCEP,
    getAddressType,
    getDistrict,
    getStates,
    getCity,
    addressTypeList,
    stateList,
    cityList,
    loading,
    districtList,
    currentState,
    currentCity,
    currentDistrict,
    setCurrentState,
    setCurrentCity,
    setCurrentDistrict,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
