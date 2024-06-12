import { useParams } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  User,
  Users,
  Receipt,
  Home,
  ShoppingBasket,
  PhoneCall,
  BookOpenText,
} from "lucide-react";

import Personal from "@/features/client/forms/personal";
import { Address } from "@/features/client/table/list-address";
import { Invoices } from "@/features/client/table/list-invoices";
import { Contacts } from "@/features/client/table/list-contacts";
import { Discounts } from "@/features/client/table/list-discount";
import { Signatures } from "@/features/client/table/list-signatures";
import { Dependents } from "@/features/client/table/list-dependents";
import { ClientHistory } from "@/features/client/table/list-history";
import useClient from "@/hooks/useClient";
import useDiscount from "@/hooks/useDiscount";
import useSignature from "@/hooks/useSignature";

export default function ClientDetails() {
  const { clientId } = useParams();
  const { getClientByid } = useClient();
  const { getDiscountsByClient } = useDiscount();
  const { getSignatureByClient } = useSignature();

  getDiscountsByClient(Number(clientId));
  getSignatureByClient(Number(clientId));
  getClientByid(Number(clientId));

  return (
    <div className="sx:p-0 md:p-6 pt-1 h-screen space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-8 h-16 xl:pl-96 xl:pr-96">
            <div className="text-center">
              <TabsTrigger
                value="personal"
                className="rounded w-12 h-12"
                aria-label="Dados do cliente"
              >
                <User className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger
                value="contacts"
                className="rounded w-12 h-12"
                aria-label="Lista dos dados de contato"
              >
                <PhoneCall className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger
                value="dependents"
                className="rounded w-12 h-12"
                aria-label="Lista de dependentes"
              >
                <Users className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger
                value="address"
                className="rounded w-12 h-12"
                aria-label="Lista de endereços"
              >
                <Home className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger
                value="products"
                className="rounded w-12 h-12"
                aria-label="Lista de assinaturas e descontos"
              >
                <ShoppingBasket className="w-6 h-6" />
              </TabsTrigger>
            </div>
            <div className="text-center">
              <TabsTrigger
                value="invoices"
                className="rounded w-12 h-12"
                aria-label="Lista de boletos"
              >
                <Receipt className="w-6 h-6" />
              </TabsTrigger>
            </div>

            <div className="text-center">

            <div className="text-center">
              <TabsTrigger
                value="history"
                className="rounded w-12 h-12"
                aria-label="Histórico de movimentação cadastral"
              >
                <BookOpenText className="w-6 h-6" />
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
                  <Personal />
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
                <Contacts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependents">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Dependentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Dependents />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Endereços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Address />
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

            <Separator className="my-3" />

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
                <Invoices />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ClientHistory />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
