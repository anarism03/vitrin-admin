import axiosInstance from "./axiosInstance";
import type {
  LoginForm,
  LoginResponse,
  RegisterForm,
  ResendCodeForm,
  VerifyEmailForm,
} from "../types/auth.type";

const AuthService = {
  register: (payload: RegisterForm) =>
    axiosInstance.post("/auth/register", payload),

  verifyEmail: (payload: VerifyEmailForm) =>
    axiosInstance.post("/auth/verify-email", payload),

  resendVerifyCode: (payload: ResendCodeForm) =>
    axiosInstance.post("/auth/resend-verification-code", payload),

  login: (payload: LoginForm) =>
    axiosInstance.post<LoginResponse>("/auth/login", payload),

  logout: () => axiosInstance.post("/auth/logout"),

  profile: () => axiosInstance.get("/auth/profile"),

  me: () => axiosInstance.get("/auth/profile"),
};

export default AuthService;
