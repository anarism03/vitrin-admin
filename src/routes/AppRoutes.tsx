import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const Categories = lazy(() => import("../pages/categories/Categories"));
const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/login/Login"));
const Products = lazy(() => import("../pages/products/Products"));
const PlaceholderPage = lazy(() => import("../pages/admin/PlaceholderPage"));

const routeFallback = (
  <div className="flex min-h-48 items-center justify-center text-sm font-medium text-slate-500">
    Yüklənir...
  </div>
);

const withSuspense = (children: ReactNode) => (
  <Suspense fallback={routeFallback}>{children}</Suspense>
);

const protectedPage = (children: ReactNode) => (
  <PrivateRoute>
    <DashboardLayout>{withSuspense(children)}</DashboardLayout>
  </PrivateRoute>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            {withSuspense(<Login />)}
          </PublicRoute>
        }
      />

      <Route path="/" element={protectedPage(<Home />)} />
      <Route path="/products" element={protectedPage(<Products />)} />
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
