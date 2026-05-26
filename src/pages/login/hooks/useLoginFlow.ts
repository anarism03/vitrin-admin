import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Form } from "antd";
import axios from "axios";
import AuthService from "../../../services/AuthService";
import { setAuthSession, setAuthUser } from "../../../store/authSlice";
import { useAppDispatch } from "../../../store/hooks";
import type {
  AuthSession,
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  const makeSession = (
    response: LoginResponse,
    email: string,
  ): AuthSession => {
    const user =
      response.user ??
      (extractUser(response) as AuthUser | null) ??
      ({ id: email, email } as AuthUser);

    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user,
      userEmail: email,
    };
  };

  const handleLogin = async (values: LoginFormType) => {
    setLoading(true);

    try {
      const res = await AuthService.login(values);
      const inner = unwrap<LoginResponse>(res.data);
      const session = makeSession(inner, values.email);

      if (!session.accessToken || !session.refreshToken) {
        throw new Error("Server cavabında token tapılmadı.");
      }

      dispatch(setAuthSession(session));

      try {
        const profileRes = await AuthService.me();
        const profileUser = extractUser(profileRes.data);
        if (profileUser) dispatch(setAuthUser(profileUser as AuthUser));
      } catch {
        // Login cavabındakı user ilə davam etmək kifayətdir.
      }

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
      openVerifyForm(values.email);
      message.success("Tesdiq kodu gonderildi");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        await AuthService.resendVerifyCode({ email: values.email });
        openVerifyForm(values.email);
        message.warning("Bu email artiq qeydiyyatdadir. Tesdiq kodu yeniden gonderildi.");
        return;
      }

      message.error(getErrorMessage(err, "Qeydiyyat zamanı xəta baş verdi."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (values: VerifyEmailForm) => {
    setLoading(true);

    try {
      await AuthService.verifyEmail(values);
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
