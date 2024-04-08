import { Users } from "lucide-react";
import { LogOut } from "lucide-react";
import { Receipt } from "lucide-react";
import { BarChartBig } from "lucide-react";
import { ShoppingBasket } from "lucide-react";

import Dashboard from "./dashboard";
import Invoice from "./invoice";
import Product from "./product";
import Logoff from "./logoff";
import Client from "./client";

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
