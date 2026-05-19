import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Form, Segmented } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { AuthService } from "../../services/AuthService";
import { useAuth } from "../../auth/AuthContext";
import {
  extractUser,
  getErrorMessage,
  isEmailNotVerifiedError,
  unwrap,
} from "../../utils/getErrorMessage";
import LoginHero from "./LoginHero";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import VerifyForm from "./VerifyForm";
import type {
  AuthUser,
  LoginForm as LoginFormType,
  LoginResponse,
  RegisterForm as RegisterFormType,
  VerifyEmailForm,
} from "../../types/auth.type";

type Mode = "login" | "register" | "verify";

const TITLES: Record<Mode, { title: string; subtitle: string }> = {
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

export default function Login() {
  const navigate = useNavigate();
  const { loginWithTokens, setUser } = useAuth();
  const { message } = App.useApp();

  const [mode, setMode] = useState<Mode>("login");
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

  const { title, subtitle } = TITLES[mode];
  const subtitleText =
    mode === "verify" && pendingEmail
      ? `${pendingEmail} üçün göndərilən təsdiq kodunu daxil edin.`
      : subtitle;

  return (
    <div className="grid min-h-[720px] w-full overflow-x-hidden bg-slate-50 lg:min-h-screen lg:grid-cols-5">
      <LoginHero />

      <div className="flex min-h-[720px] items-center justify-center bg-white px-5 py-6 sm:px-8 lg:col-span-2 lg:min-h-screen lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-4 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              A
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>

          <div className="mb-4">
            {mode === "verify" && (
              <button
                type="button"
                onClick={() => setMode("register")}
                className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-blue-600"
              >
                <ArrowLeftOutlined /> Geri
              </button>
            )}

            <h2 className="mb-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {title}
            </h2>
            <p className="text-sm text-slate-500 sm:text-[15px]">
              {subtitleText}
            </p>
          </div>

          {mode !== "verify" && (
            <Segmented
              block
              value={mode}
              onChange={(value) => setMode(value as Mode)}
              options={[
                { label: "Daxil ol", value: "login" },
                { label: "Qeydiyyat", value: "register" },
              ]}
              style={{ marginBottom: 14, padding: 4 }}
              size="large"
            />
          )}

          {mode === "login" && (
            <LoginForm
              form={loginFormInstance}
              loading={loading}
              onSubmit={handleLogin}
              onGoRegister={() => setMode("register")}
            />
          )}

          {mode === "register" && (
            <RegisterForm
              form={registerFormInstance}
              loading={loading}
              onSubmit={handleRegister}
              onGoLogin={() => setMode("login")}
            />
          )}

          {mode === "verify" && (
            <VerifyForm
              form={verifyFormInstance}
              loading={loading}
              resendLoading={resendLoading}
              onSubmit={handleVerify}
              onResend={handleResend}
            />
          )}
        </div>
      </div>
    </div>
  );
}
