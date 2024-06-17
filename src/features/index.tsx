import { lazy } from "react";
import { Users, User as UserIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { Receipt } from "lucide-react";
import { BarChartBig } from "lucide-react";
import { ShoppingBasket } from "lucide-react";

const Dashboard = lazy(() => import("@/features/dashboard"));
const Invoice = lazy(() => import("@/features/invoice"));
const InvoiceDetail = lazy(() => import("@/features/invoice/detail"));
const BatchGenerator = lazy(() => import("@/features/batch-generator"));
const Product = lazy(() => import("@/features/product"));
const ProductDetails = lazy(() => import("@/features/product/details"));
const Logoff = lazy(() => import("@/features/logoff"));
const Client = lazy(() => import("@/features/client"));
const ClientAdd = lazy(() => import("@/features/client/add"));
const ClientDetails = lazy(() => import("@/features/client/details"));
const User = lazy(() => import("@/features/user"));
const UserDetail = lazy(() => import("@/features/user/details"));

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
    path: "/client/:clientId",
    isMenuItem: false,
    element: <ClientDetails />,
  },
  {
    label: "Associados",
    path: "/client/add",
    isMenuItem: false,
    element: <ClientAdd />,
  },
  {
    label: "Boletos",
    path: "/invoice",
    isMenuItem: true,
    element: <Invoice />,
    icon: <Receipt />,
  },
  {
    label: "Boletos",
    path: "/invoice/add",
    isMenuItem: false,
    element: <InvoiceDetail />,
  },
  {
    label: "Boletos",
    path: "/invoice/:invoiceId",
    isMenuItem: false,
    element: <InvoiceDetail />,
  },
  {
    label: "Processamento de boletos",
    path: "/batch",
    isMenuItem: false,
    element: <BatchGenerator />,
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
    path: "/product/:productId",
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
    path: "/user/:userId",
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
