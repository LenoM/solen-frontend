import { Users } from "lucide-react";
import { LogOut } from "lucide-react";
import { Receipt } from "lucide-react";
import { BarChartBig } from "lucide-react";
import { ShoppingBasket } from "lucide-react";

import Dashboard from "@/features/dashboard";
import Invoice from "@/features/invoice";
import Product from "@/features/product";
import Logoff from "@/features/logoff";
import Client from "@/features/client";
import Details from "@/features/client/details";

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
    element: <Details />,
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
    label: "Sair",
    path: "/logoff",
    isMenuItem: true,
    element: <Logoff />,
    icon: <LogOut />,
  },
];
