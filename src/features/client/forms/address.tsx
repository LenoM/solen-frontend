import * as yup from "yup";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { normalizeCepNumber } from "@/utils/document-utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

type AddressAttr = {
  id: number;
  name: string;
  description: string;
  cityId: number;
  stateId: number;
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
  districtId: yup.string().required(customError.required),
  address: yup.string().required(customError.required),
  addressNumber: yup
    .number()
    .min(0, customError.min)
    .required(customError.required),
  complement: yup.string().required(customError.required),
  addressTypeId: yup.string().required(customError.required),
  addressCategory: yup.string().required(customError.required),
});

export type AddressType = yup.InferType<typeof addressSchema>;

export default function AddressForm() {
  const { id } = useParams();

  const [cityList, setCityList] = useState<AddressAttr[]>([]);
  const [stateList, setStateList] = useState<AddressAttr[]>([]);
  const [districtList, setDistrictList] = useState<AddressAttr[]>([]);
  const [addressTypeList, setAddressTypeList] = useState<AddressAttr[]>([]);

  const form = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      cep: "",
      city: "",
      state: "",
      districtId: "",
      address: "",
      addressNumber: undefined,
      complement: "",
      addressTypeId: "",
      addressCategory: "",
    },
  });

  const cepValue = form.watch("cep");
  const stateValue = form.watch("state");
  const cityValue = form.watch("city");

  useEffect(() => {
    getAllStates();
    getAllAddressType();
  }, []);

  useEffect(() => {
    form.setValue("cep", normalizeCepNumber(cepValue));
    onChangeCEP();
  }, [cepValue]);

  useEffect(() => {
    onChangeCity(Number(cityValue));
  }, [cityValue]);

  useEffect(() => {
    onChangeState(Number(stateValue));
  }, [stateValue]);

  const getAllStates = async () => {
    const allStates = await getStates();
    setStateList(allStates);
  };

  const getAllAddressType = async () => {
    const allAddressTypes = await getAddressType();
    setAddressTypeList(allAddressTypes);
  };

  const onChangeState = async (addressStateId: number) => {
    const allCities = await getCity(addressStateId);
    setCityList(allCities);
  };

  const onChangeCity = async (addressCityId: number) => {
    const allDistricts = await getDistrict(addressCityId);
    setDistrictList(allDistricts);
  };

  const onChangeCEP = async () => {
    if (cepValue.length > 8) {
      form.setValue("state", "");
      form.setValue("city", "");
      form.setValue("districtId", "");
      form.setValue("address", "");

      const result = await getAddressByCEP(cepValue);

      if (result.length > 0) {
        const { district, address } = result[0];
        const { city } = district;
        const { state } = city;

        form.setValue("state", state.id.toString());
        form.setValue("city", city.id.toString());
        form.setValue("districtId", district.id.toString());
        form.setValue("address", address);
      }
    }
  };

  const onSubmit = async () => {
    try {
      const data: AddressType = form.getValues();
      data.cep = data.cep.replace('-', '').replace('.', '')

      await createAddress(Number(id), data);
    } catch (error) {
      form.setError("root", {
        message: "Ocorreu um erro na tentativa de login.",
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
                        <Input {...field} maxLength={8} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? stateList.find(
                                    (state) =>
                                      state.id.toString() === field.value
                                  )?.name
                                : "Selecione o estado"}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="solen-popover-content p-0">
                          <Command>
                            <CommandInput placeholder="Procure o estado" />
                            <CommandEmpty>Não localizado...</CommandEmpty>
                            <CommandGroup>
                              {stateList.map((state) => (
                                <CommandItem
                                  value={state.name}
                                  key={state.id.toString()}
                                  onSelect={() => {
                                    form.setValue("state", state.id.toString());
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      state.id.toString() === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {state.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? cityList.find(
                                    (city) => city.id.toString() === field.value
                                  )?.name
                                : "Selecione a cidade"}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="solen-popover-content p-0">
                          <Command>
                            <CommandInput placeholder="Procure a cidade" />
                            <CommandEmpty>Não localizado...</CommandEmpty>
                            <CommandGroup>
                              {cityList.map((city) => (
                                <CommandItem
                                  value={city.name}
                                  key={city.id.toString()}
                                  onSelect={() => {
                                    form.setValue("city", city.id.toString());
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      city.id.toString() === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {city.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="districtId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? districtList.find(
                                    (district) =>
                                      district.id.toString() === field.value
                                  )?.name
                                : "Selecione o bairro"}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="solen-popover-content p-0">
                          <Command>
                            <CommandInput placeholder="Procure o bairro" />
                            <CommandEmpty>Não localizado...</CommandEmpty>
                            <CommandGroup>
                              {districtList.map((district) => (
                                <CommandItem
                                  value={district.name}
                                  key={district.id.toString()}
                                  onSelect={() => {
                                    form.setValue(
                                      "districtId",
                                      district.id.toString()
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      district.id.toString() === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {district.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                          <SelectItem value="Residencial">
                            Residencial
                          </SelectItem>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                          <SelectItem value="Cobranca">Cobrança</SelectItem>
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
                        defaultValue={field.value}
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
                  name="addressNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input {...field} defaultValue={""} type="number" />
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

          <div className="flex flex-col">
            <FormMessage>{form?.formState?.errors?.root?.message}</FormMessage>
          </div>
        </div>
      </form>
    </Form>
  );
}
