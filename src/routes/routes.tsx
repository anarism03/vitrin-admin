import { lazy } from "react";

const Home = lazy(() => import("../pages/home/Home"));
const Products = lazy(() => import("../pages/products/Products"));
const Categories = lazy(() => import("../pages/categories/Categories"));

export const privateRoutes = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/categories", element: <Categories /> },
];
