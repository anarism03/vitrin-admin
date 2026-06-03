import { Route, Routes } from "react-router-dom";
import ErrorPage from "../pages/error/ErrorPage";
import Login from "../pages/login/Login";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
