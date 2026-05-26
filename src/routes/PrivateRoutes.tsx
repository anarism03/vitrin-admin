import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import Layout from "../components/Layout";
import ErrorPage from "../pages/error/ErrorPage";
import { privateRoutes } from "./routes";

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
