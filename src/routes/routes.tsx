import Home from "../pages/home/Home";
import Products from "../pages/products/Products";
import Categories from "../pages/categories/Categories";

export const privateRoutes = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/categories", element: <Categories /> },
];
