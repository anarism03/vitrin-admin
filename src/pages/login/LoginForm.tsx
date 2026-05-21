import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { LoginForm as LoginFormType } from "../../types/auth.type";

type Props = {
  form: FormInstance<LoginFormType>;
  loading: boolean;
  onSubmit: (values: LoginFormType) => void;
  onGoRegister: () => void;
};

const INPUT_STYLE = { height: 46, borderRadius: 10 };
const BTN_STYLE = {
  height: 48,
  fontWeight: 600,
  borderRadius: 10,
  fontSize: 15,
  marginTop: 8,
  background: "#2563eb",
  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
};

export default function LoginForm({
  form,
  loading,
  onSubmit,
  onGoRegister,
}: Props) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      requiredMark={false}
      size="large"
    >
      <Form.Item
        label={<span className="font-medium text-slate-700">Email</span>}
        name="email"
        rules={[
          { required: true, message: "Email tələb olunur" },
          { type: "email", message: "Düzgün email daxil edin" },
        ]}
      >
        <Input
          prefix={<MailOutlined className="text-slate-400" />}
          placeholder="ad@numune.com"
          autoComplete="email"
          style={INPUT_STYLE}
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-medium text-slate-700">Şifrə</span>}
        name="password"
        rules={[{ required: true, message: "Şifrə tələb olunur" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-slate-400" />}
          placeholder="********"
          autoComplete="current-password"
          style={INPUT_STYLE}
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        block
        style={BTN_STYLE}
      >
        Daxil ol
      </Button>

      <p className="mt-5 text-center text-sm text-slate-500">
        Hesabınız yoxdur?{" "}
        <button
          type="button"
          onClick={onGoRegister}
          className="font-semibold text-blue-600 hover:underline"
        >
          Qeydiyyatdan keç
        </button>
      </p>
    </Form>
  );
}
