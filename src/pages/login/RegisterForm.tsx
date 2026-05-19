import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { RegisterForm as RegisterFormType } from "../../types/auth.type";
import { useFormPersist } from "../../utils/useFormPersist";

type Props = {
  form: FormInstance<RegisterFormType>;
  loading: boolean;
  onSubmit: (values: RegisterFormType) => void;
  onGoLogin: () => void;
};

const INPUT_STYLE = { height: 42, borderRadius: 10 };
const BTN_STYLE = {
  height: 44,
  fontWeight: 600,
  borderRadius: 10,
  fontSize: 15,
  marginTop: 4,
  background: "#2563eb",
  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
};

export default function RegisterForm({
  form,
  loading,
  onSubmit,
  onGoLogin,
}: Props) {
  const persist = useFormPersist<RegisterFormType>("draft:register", form, {
    exclude: ["password"],
  });

  const handleFinish = (values: RegisterFormType) => {
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
      <div className="grid grid-cols-2 gap-2">
        <Form.Item
          className="!mb-3"
          label={<span className="font-medium text-slate-700">Ad</span>}
          name="firstName"
          rules={[
            { required: true, message: "Ad tələb olunur" },
            { min: 2, message: "Ən azı 2 simvol" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-slate-400" />}
            placeholder="Anar"
            style={INPUT_STYLE}
          />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          label={<span className="font-medium text-slate-700">Soyad</span>}
          name="lastName"
          rules={[
            { required: true, message: "Soyad tələb olunur" },
            { min: 2, message: "Ən azı 2 simvol" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-slate-400" />}
            placeholder="İsmayılzadə"
            style={INPUT_STYLE}
          />
        </Form.Item>
      </div>

      <Form.Item
        className="!mb-3"
        label={<span className="font-medium text-slate-700">Email</span>}
        name="email"
        rules={[
          { required: true, message: "Email tələb olunur" },
          { type: "email", message: "Düzgün email daxil edin" },
        ]}
      >
        <Input
          prefix={<MailOutlined className="text-slate-400" />}
          placeholder="ad@nümunə.com"
          style={INPUT_STYLE}
        />
      </Form.Item>

      <Form.Item
        className="!mb-3"
        label={<span className="font-medium text-slate-700">Şifrə</span>}
        name="password"
        rules={[
          { required: true, message: "Şifrə tələb olunur" },
          { min: 6, message: "Ən azı 6 simvol" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-slate-400" />}
          placeholder="Şifrə təyin edin"
          autoComplete="new-password"
          style={INPUT_STYLE}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block style={BTN_STYLE}>
        Hesab yarat
      </Button>

      <p className="mt-3 text-center text-sm text-slate-500">
        Artıq hesabınız var?{" "}
        <button
          type="button"
          onClick={onGoLogin}
          className="font-semibold text-blue-600 hover:underline"
        >
          Daxil olun
        </button>
      </p>
    </Form>
  );
}
