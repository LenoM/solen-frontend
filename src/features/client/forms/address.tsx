import { object, string, number, InferType } from "yup";
import { FormEvent, useEffect, useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

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

import { LoadingSpinner } from "@/components/spinner";
import { normalizeCepNumber } from "@/utils/format-utils";
import { ErrorMessage } from "@/utils/error.enum";
import useAddress from "@/hooks/useAddress";

const emptyEntity = { id: "", abbreviation: "", description: "" };

export const loadAddressData = (data?: AddressDataType) => {
  return {
    id: data?.id || 0,
    cep: data?.cep || "",
    stateId: data?.stateId || "",
    cityId: data?.cityId || "",
    districtId: data?.districtId || "",
    address: data?.address || "",
    number: data?.number || 0,
    complement: data?.complement || "",
    addressTypeId: data?.addressTypeId || undefined,
    addressCategory: data?.addressCategory || "",
    city: data?.city || emptyEntity,
    state: data?.state || emptyEntity,
    district: data?.district || emptyEntity,
    addressType: data?.addressType || emptyEntity,
  };
};

const addressEntitySchema = {
  id: string().optional().default(null),
  abbreviation: string().optional().default(null),
};

export const addressBaseSchema = {
  id: number().optional(),
  cep: string().required(ErrorMessage.required),
  districtId: string(),
  stateId: string(),
  cityId: string(),
  address: string().required(ErrorMessage.required),
  number: number().min(0, ErrorMessage.min).required(ErrorMessage.required),
  complement: string(),
  addressTypeId: number(),
  addressCategory: string().nullable().required(ErrorMessage.required),
  city: object().shape({ ...addressEntitySchema }),
  state: object().shape({ ...addressEntitySchema }),
  district: object().shape({ ...addressEntitySchema }),
  addressType: object().shape({ ...addressEntitySchema }),
};

const addressSchema = object().shape({
  ...addressBaseSchema,
});

export type AddressDataType = InferType<typeof addressSchema>;

type AddressFormProps = {
  isSaveLoading: boolean;
  data: AddressDataType;
  onSubmit: (newData: AddressDataType) => void;
};

export default function AddressForm({
  data,
  isSaveLoading,
  onSubmit,
}: AddressFormProps) {
  const {
    loading,
    getAddressByCEP,
    getStates,
    stateList,
    cityList,
    districtList,
    addressTypeList,
    currentState,
    currentCity,
    getAddressType,
    setCurrentState,
    setCurrentCity,
    setCurrentDistrict,
    currentDistrict,
    getDistrict,
    getCity,
  } = useAddress();

  const isLoading =
    loading ||
    isSaveLoading ||
    stateList.length === 0 ||
    addressTypeList.length === 0;

  const form = useForm({
    resolver: yupResolver(addressSchema),
    values: loadAddressData(data),
  });

  useMemo(async () => await getStates(), []);
  useMemo(async () => await getAddressType(), []);

  useEffect(() => {
    loadInitialData(data);
  }, [data]);

  useEffect(() => {
    form.setValue("stateId", currentState);
  }, [currentState]);

  useEffect(() => {
    form.setValue("cityId", currentCity);
  }, [currentCity]);

  useEffect(() => {
    form.setValue("districtId", currentDistrict);
  }, [currentDistrict]);

  const loadInitialData = (data: AddressDataType) => {
    if (data.stateId) {
      onChangeState(data.stateId);
    }

    if (data.cityId) {
      onChangeCity(data.cityId);
    }

    if (data.districtId) {
      onChangeDistrict(data.districtId);
    }
  };

  const onChangeCEP = async (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const cep = normalizeCepNumber(input);
    form.setValue("cep", cep);
  };

  const onBlurCEP = async (e: FormEvent<HTMLInputElement>) => {
    const cep = e.currentTarget.value;

    if (cep.length === 10) {
      await getAddressByCEP(cep);
    }
  };

  const onChangeState = async (addressStateId: string) => {
    if (addressStateId && addressStateId !== currentState) {
      await getCity(addressStateId);
      setCurrentState(addressStateId);
    }
  };

  const onChangeCity = async (addressCityId: string) => {
    if (addressCityId && addressCityId !== currentCity) {
      await getDistrict(addressCityId);
      setCurrentCity(addressCityId);
    }
  };

  const onChangeDistrict = async (districtId: string) => {
    if (districtId && districtId !== currentDistrict) {
      setCurrentDistrict(districtId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
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
                    name="stateId"
                    control={form.control}
                    render={() => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          value={form.getValues("stateId")}
                          defaultValue={form.getValues("stateId")}
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
                    name="cityId"
                    control={form.control}
                    render={() => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <Select
                          value={form.getValues("cityId")}
                          defaultValue={form.getValues("cityId")}
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
                    name="districtId"
                    render={() => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <Select
                          value={form.getValues("districtId")}
                          defaultValue={form.getValues("districtId")}
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
                              <SelectValue placeholder="Escolha a categoria" />
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
                    name="addressTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de endereço</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha o tipo" />
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
        )}
      </form>
    </Form>
  );
}
