import { Users, User as UserIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { Receipt } from "lucide-react";
import { BarChartBig } from "lucide-react";
import { ShoppingBasket } from "lucide-react";

import Dashboard from "@/features/dashboard";
import Invoice from "@/features/invoice";
import Product from "@/features/product";
import ProductDetails from "@/features/product/details";
import Logoff from "@/features/logoff";
import Client from "@/features/client";
import ClientDetails from "@/features/client/details";
import User from "@/features/user";
import UserDetail from "@/features/user/details";

export const features = [
  {
    label: "Dashboard",
    path: "/",
    isMenuItem: true,
    element: <Dashboard />,
    icon: <BarChartBig />,
  },
  {
    label: "Associados",
    path: "/client",
    isMenuItem: true,
    element: <Client />,
    icon: <Users />,
  },
  {
    label: "Associados",
    path: "/client/:id",
    isMenuItem: false,
    element: <ClientDetails />,
  },
  {
    label: "Boletos",
    path: "/invoice",
    isMenuItem: true,
    element: <Invoice />,
    icon: <Receipt />,
  },
  {
    label: "Produtos",
    path: "/product",
    isMenuItem: true,
    element: <Product />,
    icon: <ShoppingBasket />,
  },
  {
    label: "Produto",
    path: "/product/:id",
    isMenuItem: false,
    element: <ProductDetails />,
  },
  {
    label: "Usuarios",
    path: "/user",
    isMenuItem: true,
    element: <User />,
    icon: <UserIcon />,
  },
  {
    label: "Usuario",
    path: "/user/:id",
    isMenuItem: false,
    element: <UserDetail />,
  },
  {
    label: "Sair",
    path: "/logoff",
    isMenuItem: true,
    element: <Logoff />,
    icon: <LogOut />,
  },
];
