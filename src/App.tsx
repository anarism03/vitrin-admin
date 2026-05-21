import { BrowserRouter } from "react-router-dom";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import { useAppSelector } from "./store/hooks";

export default function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
    </BrowserRouter>
  );
}
