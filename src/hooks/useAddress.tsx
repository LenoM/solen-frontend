import { toast } from "sonner";
import { useState } from "react";

import type { AddressDataType } from "@/features/client/forms/address";
import type { ClientType } from "@/features/client/forms/personal";
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

    const url = `address/${input}`;

    const response = await fetcher.get(url);

    if (response) {
      const { district } = response[0];
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
      }
    }

    setLoading(false);
  };

  const getAddressType = async () => {
    setLoading(true);

    const response = await fetcher.get("address-type");

    if (response) {
      setAddressTypeList(response);
    }

    setLoading(false);
  };

  const getStates = async () => {
    setLoading(true);

    const response = await fetcher.get("states");

    if (response) {
      setStateList(response);
    }

    setLoading(false);
  };

  const getCity = async (stateId: string) => {
    setLoading(true);

    const url = `state/${stateId}/city`;

    const response = await fetcher.get(url);

    if (response) {
      setCityList(response);
    }

    setLoading(false);
  };

  const getDistrict = async (cityId: string) => {
    setLoading(true);

    const url = `city/${cityId}/district`;

    const response = await fetcher.get(url);

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
      addressType,
      district,
    } = data;

    const body: BodyInit = JSON.stringify({
      cep,
      address,
      number: Number(number),
      complement,
      addressCategory,
      addressTypeId: Number(addressType),
      districtId: district,
    });

    const response = await fetcher.post(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getClientById", { clientId }],
        (prev: ClientType) => {
          if (prev && prev.address) {
            return { ...prev, address: [...prev.address, response] };
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
      addressType,
      district,
    } = data;

    const url = `client/${clientId}/address/${id}`;

    const body: BodyInit = JSON.stringify({
      cep,
      address,
      number: Number(number),
      complement,
      addressCategory,
      addressTypeId: Number(addressType),
      districtId: district,
    });

    const response = await fetcher.put(url, body);

    if (response) {
      queryClient.setQueryData(
        ["getClientById", { clientId }],
        (prev: ClientType) => {
          if (prev && prev?.address) {
            const addrIndex = prev.address.findIndex(
              (adr) => Number(adr.id) === response.id
            );

            const newAddr = [
              ...prev?.address.slice(0, addrIndex),
              response,
              ...prev?.address.slice(addrIndex + 1),
            ];

            console.log("response", response);
            console.log("newAddr", newAddr);

            return { ...prev, address: newAddr };
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

    const response = await fetcher.del(url);

    if (response) {
      queryClient.setQueryData(
        ["getClientById", { clientId }],
        (prev: ClientType) => {
          prev.address = prev?.address?.filter((d) => d.id !== response.id);
          return prev;
        }
      );

      toast.success("Endereço deletado", {
        description: `O endereço #${addressId} foi removido com sucesso!`,
      });
    }

    setLoading(false);
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
