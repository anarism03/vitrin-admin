import { Route, Routes } from "react-router-dom";
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
              {route.element}
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
