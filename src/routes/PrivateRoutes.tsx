import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import Layout from "../components/Layout";
import ErrorPage from "../pages/error/ErrorPage";

const Home = lazy(() => import("../pages/home/Home"));
const Products = lazy(() => import("../pages/products/Products"));
const Categories = lazy(() => import("../pages/categories/Categories"));

const privateRoutes = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/categories", element: <Categories /> },
];

export default function PrivateRoutes() {
  return (
    <Routes>
      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Layout>
              <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><Spin size="large" /></div>}>
                {route.element}
              </Suspense>
            </Layout>
          }
        />
      ))}
      <Route
        path="*"
        element={
          <Layout>
            <ErrorPage />
          </Layout>
        }
      />
    </Routes>
  );
}
