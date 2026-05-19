import { Segmented } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LoginHero from "./LoginHero";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import VerifyForm from "./VerifyForm";
import { useLoginFlow } from "./hooks/useLoginFlow";

export default function Login() {
  const {
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
  } = useLoginFlow();

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
              onChange={(value) => setMode(value as "login" | "register")}
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
