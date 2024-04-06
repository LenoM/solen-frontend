import { ImUsers } from "react-icons/im";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { LuShoppingBasket } from "react-icons/lu";
import { FaPowerOff } from "react-icons/fa";

import Client from "./client";
import Dashboard from "./dashboard";
import Invoice from "./invoice";
import Product from "./product";
import Logoff from "./logoff";

export const features = [
  {
    label: "Dashboard",
    path: "/",
    isMenuItem: true,
    element: <Dashboard />,
    icon: <BsGraphUpArrow />,
  },
  {
    label: "Associados",
    path: "/client",
    isMenuItem: true,
    element: <Client />,
    icon: <ImUsers />,
  },
  {
    label: "Boletos",
    path: "/invoice",
    isMenuItem: true,
    element: <Invoice />,
    icon: <FaFileInvoiceDollar />,
  },
  {
    label: "Produtos",
    path: "/product",
    isMenuItem: true,
    element: <Product />,
    icon: <LuShoppingBasket />,
  },
  {
    label: "Sair",
    path: "/logoff",
    isMenuItem: true,
    element: <Logoff />,
    icon: <FaPowerOff />,
  },
];
