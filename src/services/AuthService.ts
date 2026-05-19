import axiosInstance from "./axiosInstance";
import type {
  LoginForm,
  LoginResponse,
  RegisterForm,
  ResendCodeForm,
  VerifyEmailForm,
  AuthUser,
} from "../types/auth.type";

export const AuthService = {
  register: (payload: RegisterForm) =>
    axiosInstance.post("/auth/register", payload),

  verifyEmail: (payload: VerifyEmailForm) =>
    axiosInstance.post("/auth/verify-email", payload),

  resendVerifyCode: (payload: ResendCodeForm) =>
    axiosInstance.post("/auth/resend-verification-code", payload),

  login: (payload: LoginForm) =>
    axiosInstance.post<LoginResponse>("/auth/login", payload),

  logout: () => axiosInstance.post("/auth/logout"),

  me: () => axiosInstance.get("/auth/profile"),
};
