import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  User,
  Users,
  Receipt,
  Home,
  ShoppingBasket,
  PhoneCall,
} from "lucide-react";

import { Dependents } from "./dependents";
import { Address } from "./address";
import { Invoices } from "./invoices";
import { Products } from "./products";
import { Contacts } from "./contacts";

import Personal from "@/features/client/forms/personal";
import AddressForm, { loadAddressData } from "@/features/client/forms/address";
import ContactForm, { loadContactData } from "@/features/client/forms/contact";

import { getClientByid } from "@/services/client";

export default function Details() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    getData(id);
  }, [id]);

  const getData = async (id: string | undefined) => {
    if (id) {
      const result = await getClientByid(Number(id));
      console.log("data", result);
      setData(result);
    }
  };

  return (
    <div className="p-6 pt-1 h-screen space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-6 h-16 xl:pl-96 xl:pr-96">
            <div className="text-center">
              <TabsTrigger value="personal" className="rounded w-12 h-12">
                <User className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger value="contacts" className="rounded w-12 h-12">
                <PhoneCall className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger value="dependents" className="rounded w-12 h-12">
                <Users className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger value="address" className="rounded w-12 h-12">
                <Home className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger value="products" className="rounded w-12 h-12">
                <ShoppingBasket className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger value="invoices" className="rounded w-12 h-12">
                <Receipt className="w-6 h-6" />
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="personal">
            <Card className="p-8">
              <CardHeader className="text-center">
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <Personal {...data} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Contatos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Contacts {...data} />
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Adicionar novo</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar contato</DialogTitle>
                    </DialogHeader>
                    <ContactForm {...loadContactData()} />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="dependents">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Dependentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Dependents {...data} />
              </CardContent>
              <CardFooter>
                <Button>Adicionar novo</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Endereços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Address {...data} />
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Adicionar novo</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar endereço</DialogTitle>
                    </DialogHeader>
                    <AddressForm {...loadAddressData()} />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Produtos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Products {...data} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Boletos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Invoices {...data} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
