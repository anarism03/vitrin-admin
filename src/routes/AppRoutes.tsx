import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import PlaceholderPage from "../pages/admin/PlaceholderPage";
import Categories from "../pages/categories/Categories";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const protectedPage = (children: ReactNode) => (
  <PrivateRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </PrivateRoute>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route path="/" element={protectedPage(<Home />)} />
      <Route
        path="/products"
        element={
          protectedPage(
            <PlaceholderPage
              title="Məhsullar"
              description="Məhsullar siyahısı və redaktə bölməsi."
            />,
          )
        }
      />
      <Route path="/categories" element={protectedPage(<Categories />)} />
      <Route
        path="/users"
        element={
          protectedPage(
            <PlaceholderPage
              title="İstifadəçilər"
              description="İstifadəçi hesabları və rolları."
            />,
          )
        }
      />
      <Route
        path="/stats"
        element={
          protectedPage(
            <PlaceholderPage
              title="Statistika"
              description="Panel və API aktivliyi üzrə göstəricilər."
            />,
          )
        }
      />
      <Route
        path="/settings"
        element={
          protectedPage(
            <PlaceholderPage
              title="Parametrlər"
              description="Panel konfiqurasiyası və sistem ayarları."
            />,
          )
        }
      />
      <Route
        path="/logs"
        element={
          protectedPage(
            <PlaceholderPage
              title="API loglar"
              description="API sorğuları və sistem logları."
            />,
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
