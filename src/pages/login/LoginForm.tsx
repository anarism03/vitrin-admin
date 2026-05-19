import { Button, Form, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { LoginForm as LoginFormType } from "../../types/auth.type";
import { useFormPersist } from "../../utils/useFormPersist";

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

export default function LoginForm({ form, loading, onSubmit, onGoRegister }: Props) {
  const persist = useFormPersist<LoginFormType>("draft:login", form, {
    exclude: ["password"],
  });

  const handleFinish = (values: LoginFormType) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={persist.onValuesChange}
      requiredMark={false}
      size="large"
    >
      <Form.Item
        label={<span className="text-slate-700 font-medium">Email</span>}
        name="email"
        rules={[
          { required: true, message: "Email tələb olunur" },
          { type: "email", message: "Düzgün email daxil edin" },
        ]}
      >
        <Input
          prefix={<MailOutlined className="text-slate-400" />}
          placeholder="ad@nümunə.com"
          autoComplete="email"
          style={INPUT_STYLE}
        />
      </Form.Item>

      <Form.Item
        label={<span className="text-slate-700 font-medium">Şifrə</span>}
        name="password"
        rules={[{ required: true, message: "Şifrə tələb olunur" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-slate-400" />}
          placeholder="••••••••"
          autoComplete="current-password"
          style={INPUT_STYLE}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block style={BTN_STYLE}>
        Daxil ol
      </Button>

      <p className="text-center text-sm text-slate-500 mt-5">
        Hesabınız yoxdur?{" "}
        <button
          type="button"
          onClick={onGoRegister}
          className="text-blue-600 font-semibold hover:underline"
        >
          Qeydiyyatdan keç
        </button>
      </p>
    </Form>
  );
}
