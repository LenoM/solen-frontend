import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { AddressDataType } from "@/features/client/forms/address";
import { queryClient } from "@/lib/react-query";
import useFetcher from "@/lib/request";

type AddressAttr = {
  id: string;
  name: string;
  description: string;
  cityId: string;
  stateId: string;
};

export default function useAddress() {
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);

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

    const url = `address/${input}`;

    const response = await fetcher.get<AddressDataType[]>(url);

    if (response && response.length > 0) {
      const { districtId, cityId, stateId } = response[0];

      if (cityId && stateId && districtId) {
        /*** Set State */
        setCurrentState(stateId);

        /*** Set City */
        const hasCity = cityList.filter((el) => el.cityId === cityId).length;

        if (cityList.length === 0 || !hasCity) {
          await getCity(stateId);
          setCurrentCity(cityId);
        }

        /*** Set District */
        const hasDistrict = districtList.filter(
          (el) => el.id === districtId
        ).length;

        if (districtList.length === 0 || !hasDistrict) {
          await getDistrict(cityId);
          setCurrentDistrict(districtId);
        }
      }
    }

    setLoading(false);
  };

  const getAddressType = async () => {
    setLoading(true);

    const response = await fetcher.get<AddressAttr[]>("address-type");

    if (response) {
      setAddressTypeList(response);
    }

    setLoading(false);
  };

  const getStates = async () => {
    setLoading(true);

    const response = await fetcher.get<AddressAttr[]>("states");

    if (response) {
      setStateList(response);
    }

    setLoading(false);
  };

  const getCity = async (stateId: string) => {
    setLoading(true);

    const url = `state/${stateId}/city`;

    const response = await fetcher.get<AddressAttr[]>(url);

    if (response) {
      setCityList(response);
    }

    setLoading(false);
  };

  const getDistrict = async (cityId: string) => {
    setLoading(true);

    const url = `city/${cityId}/district`;

    const response = await fetcher.get<AddressAttr[]>(url);

    if (response) {
      setDistrictList(response);
    }

    setLoading(false);
  };

  const createAddress = async (clientId: number, data: AddressDataType) => {
    setLoading(true);

    const url = `client/${clientId}/address`;

    const {
      cep,
      address,
      number,
      complement,
      addressCategory,
      addressTypeId,
      districtId,
    } = data;

    const body: BodyInit = JSON.stringify({
      cep,
      address,
      number: Number(number),
      complement,
      addressCategory,
      addressTypeId: Number(addressTypeId),
      districtId: districtId,
    });

    const response = await fetcher.post<AddressDataType>(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getAddressByClient", { clientId }],
        (prev: AddressDataType[]) => {
          if (prev) {
            return [...prev, response];
          }
        }
      );

      toast.success("Endereço salvo", {
        description: `O endereço #${response.id} foi salvo`,
      });
    }

    setLoading(false);
  };

  const updateAddress = async (clientId: number, data: AddressDataType) => {
    setLoading(true);

    const {
      id,
      cep,
      address,
      number,
      complement,
      addressCategory,
      addressTypeId,
      districtId,
    } = data;

    const url = `client/${clientId}/address/${id}`;

    const body: BodyInit = JSON.stringify({
      cep,
      address,
      number: Number(number),
      complement,
      addressCategory,
      addressTypeId: Number(addressTypeId),
      districtId: districtId,
    });

    const response = await fetcher.put<AddressDataType>(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getAddressByClient", { clientId }],
        (prev: AddressDataType[]) => {
          if (prev) {
            const addrIndex = prev.findIndex(
              (adr) => Number(adr.id) === response.id
            );

            const newAddr = [
              ...prev.slice(0, addrIndex),
              response,
              ...prev.slice(addrIndex + 1),
            ];

            return newAddr;
          }
        }
      );

      toast.success("Endereço salvo", {
        description: `O endereço #${response.id} foi salvo`,
      });
    }

    setLoading(false);
  };

  const deleteAddress = async (clientId: number, addressId: number) => {
    setLoading(true);

    const url = `client/${clientId}/address/${addressId}`;

    const response = await fetcher.del<AddressDataType>(url);

    if (response) {
      queryClient.setQueryData(
        ["getAddressByClient", { clientId }],
        (prev: AddressDataType[]) => {
          return prev?.filter((d) => d.id !== response.id);
        }
      );

      toast.success("Endereço deletado", {
        description: `O endereço #${addressId} foi removido com sucesso!`,
      });
    }

    setLoading(false);
  };

  const getAddressByClient = (clientId: number) => {
    return useQuery<AddressDataType[]>({
      queryKey: ["getAddressByClient", { clientId }],
      queryFn: () => retriveAddressByClient(clientId),
      refetchOnMount: false,
    });
  };

  const retriveAddressByClient = async (clientId: number) => {
    setLoading(true);

    if (!isNaN(clientId)) {
      const url = `client/${clientId}/address`;
      const response = await fetcher.get<AddressDataType[]>(url);

      if (response) {
        setLoading(false);
        return response;
      }
    }

    setLoading(false);
    return [];
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
    getAddressByClient,
    setCurrentDistrict,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
