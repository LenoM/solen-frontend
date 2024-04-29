import * as yup from "yup";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { normalizeCepNumber } from "@/utils/format-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getAddressByCEP,
  getAddressType,
  createAddress,
  getDistrict,
  getStates,
  getCity,
} from "@/services/address";

export const loadAddressData = (data?: AddressDataType) => {
  return {
    cep: data?.cep || "",
    state: data?.state || "",
    city: data?.city || "",
    district: data?.district || "",
    address: data?.address || "",
    number: data?.number || 0,
    complement: data?.complement,
    addressType: data?.addressType || "",
    addressCategory: data?.addressCategory || "",
  };
};

type AddressAttr = {
  id: string;
  name: string;
  description: string;
  cityId: string;
  stateId: string;
};

const customError = {
  required: "Campo obrigatório",
  equals: "Escolha o valor",
  min: "Digite o número correto",
};

const addressSchema = yup.object({
  cep: yup.string().required(customError.required),
  city: yup.string().required(customError.required),
  state: yup.string().required(customError.required),
  district: yup.string().required(customError.required),
  address: yup.string().required(customError.required),
  number: yup.number().min(0, customError.min).required(customError.required),
  complement: yup.string(),
  addressType: yup.string().required(customError.required),
  addressCategory: yup.string().required(customError.required),
});

export type AddressDataType = yup.InferType<typeof addressSchema>;

export default function AddressForm(data: AddressDataType) {
  const { id } = useParams();

  const [cityList, setCityList] = useState<AddressAttr[]>([]);
  const [stateList, setStateList] = useState<AddressAttr[]>([]);
  const [districtList, setDistrictList] = useState<AddressAttr[]>([]);
  const [addressTypeList, setAddressTypeList] = useState<AddressAttr[]>([]);

  const [currentCity, setCurrentCity] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentDistrict, setCurrentDistrict] = useState("");

  const form = useForm({
    resolver: yupResolver(addressSchema),
    values: loadAddressData(data),
  });

  useEffect(() => {
    getAllStates();
    getAllAddressType();
    loadInitialData(data);
  }, [data]);

  const getAllStates = async () => {
    const allStates = await getStates();
    setStateList(allStates);
  };

  const getAllAddressType = async () => {
    const allAddressTypes = await getAddressType();
    setAddressTypeList(allAddressTypes);
  };

  const loadInitialData = (data: AddressDataType) => {
    if (data.state) {
      setCurrentState(data.state);
      onChangeState(data.state);
    }

    if (data.city) {
      onChangeCity(data.city);
    }

    if (data.district) {
      onChangeDistrict(data.district);
    }
  };

  const onChangeCEP = async (e: React.FormEvent<HTMLInputElement>) => {
    let input = e.currentTarget.value;
    const cep = normalizeCepNumber(input);
    form.setValue("cep", cep);
  };

  const onBlurCEP = async (e: React.FormEvent<HTMLInputElement>) => {
    const cep = e.currentTarget.value;

    if (cep.length === 10) {
      const result = await getAddressByCEP(cep);

      if (result.length > 0) {
        const { district, address } = result[0];
        const { city } = district;
        const { state } = city;

        /*** Set State */
        setCurrentState(state.id);
        form.setValue("state", state.id);

        /*** Set City */
        const hasCity = cityList.filter((el) => el.cityId === city.id).length;

        if (cityList.length === 0 || !hasCity) {
          onChangeState(state.id);
        }

        setCurrentCity(city.id);
        form.setValue("city", city.id);

        /*** Set District */
        const hasDistrict = districtList.filter(
          (el) => el.id === district.id
        ).length;

        if (districtList.length === 0 || !hasDistrict) {
          onChangeCity(city.id);
        }

        setCurrentDistrict(district.id);
        form.setValue("district", district.id);

        /*** Set Address */
        form.setValue("address", address);

        return;
      }
    }
  };

  const onChangeState = async (addressStateId: string) => {
    if (addressStateId) {
      setDistrictList([]);

      const allCities = await getCity(addressStateId);
      setCityList(allCities);
      setCurrentState(addressStateId);
      form.setValue("state", addressStateId.toString());
    }
  };

  const onChangeCity = async (addressCityId: string) => {
    if (addressCityId) {
      const allDistricts = await getDistrict(addressCityId);
      setDistrictList(allDistricts);
      setCurrentCity(addressCityId);
      form.setValue("city", addressCityId.toString());
    } else {
      setDistrictList([]);
    }
  };

  const onChangeDistrict = async (districtId: string) => {
    if (districtId) {
      setCurrentDistrict(districtId);
      form.setValue("district", districtId.toString());
    }
  };

  const onSubmit = async () => {
    try {
      const newData: AddressDataType = form.getValues();

      const newAddress = await createAddress(Number(id), newData);

      if (!newAddress.id) {
        toast.error("Erro no cadastro", {
          description: "Ocorreu um erro ao tentar cadastrar o endereço",
        });

        return;
      }

      toast.info("Endereço salvo", {
        description: `O endereço #${newAddress.id} foi salvo`,
      });
    } catch (error) {
      toast.error("Falha no cadastro", {
        description: "Ocorreu uma falha ao tentar cadastrar o endereço",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <div className="grid w-full items-center gap-1">
          <div className="flex flex-col">
            <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={8}
                          onBlur={onBlurCEP}
                          onChange={onChangeCEP}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col">
                <FormField
                  name="state"
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        value={currentState?.toString()}
                        onValueChange={(value) => onChangeState(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha o estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stateList.map((stt) => {
                            return (
                              <SelectItem
                                key={`state-${stt.id}`}
                                value={stt.id.toString()}
                              >
                                {stt.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
              <div className="flex flex-col">
                <FormField
                  name="city"
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <Select
                        value={currentCity?.toString()}
                        onValueChange={(value) => onChangeCity(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha a cidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cityList.map((ct) => {
                            return (
                              <SelectItem
                                key={`city-${ct.id}`}
                                value={ct.id.toString()}
                              >
                                {ct.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="district"
                  render={() => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <Select
                        value={currentDistrict?.toString()}
                        onValueChange={(value) => onChangeDistrict(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha o bairro" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districtList.map((dst) => {
                            return (
                              <SelectItem
                                key={`district-${dst.id}`}
                                value={dst.id.toString()}
                              >
                                {dst.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="addressCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="Residencial" value="Residencial">
                            Residencial
                          </SelectItem>
                          <SelectItem key="Comercial" value="Comercial">
                            Comercial
                          </SelectItem>
                          <SelectItem key="Cobranca" value="Cobranca">
                            Cobrança
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="addressType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de endereço</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {addressTypeList.map((at) => {
                            return (
                              <SelectItem
                                key={at.id.toString()}
                                value={at.id.toString()}
                              >
                                {at.description}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col">
            <div className="grid md:grid-cols-2 xl:grid-cols-2 xs:grid-cols-1 gap-2">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-4 mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
