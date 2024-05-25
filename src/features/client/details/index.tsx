import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

import { Signatures } from "./signature";
import { Discounts } from "./discount";
import { Invoices } from "./invoices";
import { Address } from "../table/list-address";
import { Contacts } from "../table/list-contacts";
import { Clients as Dependents } from "../table/list-clients";

import Personal, { loadClientData } from "@/features/client/forms/personal";

import { getClientByid } from "@/services/client";

export default function ClientDetails() {
  const { id } = useParams();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    getData(id);
  }, [id]);

  const getData = async (id: string | undefined) => {
    if (id && !isNaN(Number(id))) {
      const result = await getClientByid(Number(id));
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
            <Card>
              <div className="xl:w-2/4 mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <Personal {...loadClientData(data)} />
              </CardContent>
              </div>
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
            </Card>
          </TabsContent>

          <TabsContent value="dependents">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Dependentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Dependents data={data.dependents} isHolder={!data.holderId} />
              </CardContent>
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
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Assinaturas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Signatures />
              </CardContent>
            </Card>

            <Separator className="my-3"/>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>Descontos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Discounts />
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
