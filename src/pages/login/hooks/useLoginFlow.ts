import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Form } from "antd";
import { useAuth } from "../../../auth/AuthContext";
import { AuthService } from "../../../services/AuthService";
import type {
  AuthUser,
  LoginForm as LoginFormType,
  LoginResponse,
  RegisterForm as RegisterFormType,
  VerifyEmailForm,
} from "../../../types/auth.type";
import {
  extractUser,
  getErrorMessage,
  isEmailNotVerifiedError,
  unwrap,
} from "../../../utils/getErrorMessage";

export type LoginMode = "login" | "register" | "verify";

const titles: Record<LoginMode, { title: string; subtitle: string }> = {
  login: {
    title: "Xoş gəlmisiniz",
    subtitle: "Davam etmək üçün email və şifrənizi daxil edin.",
  },
  register: {
    title: "Hesab yarat",
    subtitle: "Bir neçə saniyə və hesabınız hazırdır.",
  },
  verify: {
    title: "Kodu daxil edin",
    subtitle: "Email təsdiqi üçün göndərilən kodu daxil edin.",
  },
};

export function useLoginFlow() {
  const navigate = useNavigate();
  const { loginWithTokens, setUser } = useAuth();
  const { message } = App.useApp();

  const [mode, setMode] = useState<LoginMode>("login");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const [loginFormInstance] = Form.useForm<LoginFormType>();
  const [registerFormInstance] = Form.useForm<RegisterFormType>();
  const [verifyFormInstance] = Form.useForm<VerifyEmailForm>();

  const openVerifyForm = (email: string) => {
    setPendingEmail(email);
    verifyFormInstance.setFieldsValue({ email, code: "" });
    setMode("verify");
  };

  const handleLogin = async (values: LoginFormType) => {
    setLoading(true);

    try {
      const res = await AuthService.login(values);
      const inner = unwrap<any>(res.data);
      const loginUser = extractUser(res.data);
      const payload: LoginResponse = {
        accessToken: inner.accessToken ?? inner.access_token,
        refreshToken: inner.refreshToken ?? inner.refresh_token,
        user:
          (loginUser as AuthUser) ??
          ({ id: 0, email: values.email } as AuthUser),
      };

      if (!payload.accessToken) {
        throw new Error("Server cavabında token tapılmadı.");
      }

      loginWithTokens(payload);

      try {
        const profileRes = await AuthService.me();
        const profileUser = extractUser(profileRes.data);
        if (profileUser) setUser(profileUser as AuthUser);
      } catch {
        // Login response-da olan user ilə davam etmək kifayətdir.
      }

      localStorage.removeItem("draft:login");
      message.success("Xoş gəlmisiniz!");
      navigate("/", { replace: true });
    } catch (err) {
      if (isEmailNotVerifiedError(err)) {
        message.warning("Bu mail təsdiqlənməyib!");
        openVerifyForm(values.email);
        return;
      }

      message.error(getErrorMessage(err, "Email və ya şifrə yanlışdır."));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormType) => {
    setLoading(true);

    try {
      await AuthService.register(values);
      localStorage.removeItem("draft:register");
      openVerifyForm(values.email);
      message.success("Təsdiq kodu göndərildi");
    } catch (err) {
      message.error(getErrorMessage(err, "Qeydiyyat zamanı xəta baş verdi."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (values: VerifyEmailForm) => {
    setLoading(true);

    try {
      await AuthService.verifyEmail(values);
      localStorage.removeItem("draft:verify");
      loginFormInstance.setFieldsValue({ email: values.email, password: "" });
      message.success("Hesab təsdiqləndi");
      setMode("login");
    } catch (err) {
      message.error(getErrorMessage(err, "Kod düzgün deyil."));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = verifyFormInstance.getFieldValue("email") || pendingEmail;

    if (!email) {
      message.warning("Əvvəlcə email daxil edin");
      return;
    }

    setResendLoading(true);

    try {
      await AuthService.resendVerifyCode({ email });
      message.success("Yeni kod göndərildi");
    } catch (err) {
      message.error(getErrorMessage(err, "Kod göndərilmədi."));
    } finally {
      setResendLoading(false);
    }
  };

  const { title, subtitle } = titles[mode];
  const subtitleText =
    mode === "verify" && pendingEmail
      ? `${pendingEmail} üçün göndərilən təsdiq kodunu daxil edin.`
      : subtitle;

  return {
    handleLogin,
    handleRegister,
    handleResend,
    handleVerify,
    loading,
    loginFormInstance,
    mode,
    registerFormInstance,
    resendLoading,
    setMode,
    subtitleText,
    title,
    verifyFormInstance,
  };
}
