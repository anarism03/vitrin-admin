import { Button, Form, Input } from "antd";
import { MailOutlined, SafetyCertificateOutlined, SendOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { VerifyEmailForm } from "../../types/auth.type";
import { useFormPersist } from "../../utils/useFormPersist";

type Props = {
  form: FormInstance<VerifyEmailForm>;
  loading: boolean;
  resendLoading: boolean;
  onSubmit: (values: VerifyEmailForm) => void;
  onResend: () => void;
};

const INPUT_STYLE = { height: 46, borderRadius: 10 };
const BTN_STYLE = {
  height: 48,
  fontWeight: 600,
  borderRadius: 10,
  fontSize: 15,
  background: "#2563eb",
  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
};

export default function VerifyForm({ form, loading, resendLoading, onSubmit, onResend }: Props) {
  const persist = useFormPersist<VerifyEmailForm>("draft:verify", form, {
    exclude: ["code"],
  });

  const handleFinish = (values: VerifyEmailForm) => {
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
        <Input prefix={<MailOutlined className="text-slate-400" />} style={INPUT_STYLE} />
      </Form.Item>

      <Form.Item
        label={<span className="text-slate-700 font-medium">Təsdiq kodu</span>}
        name="code"
        rules={[
          { required: true, message: "Kod tələb olunur" },
          { min: 4, message: "Kod ən azı 4 simvol olmalıdır" },
        ]}
      >
        <Input
          prefix={<SafetyCertificateOutlined className="text-slate-400" />}
          placeholder="6 rəqəmli kod"
          maxLength={8}
          style={{ ...INPUT_STYLE, letterSpacing: 4, fontSize: 17, fontWeight: 600 }}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block style={BTN_STYLE}>
        Təsdiqlə
      </Button>

      <div className="flex items-center justify-center mt-4">
        <Button type="link" icon={<SendOutlined />} onClick={onResend} loading={resendLoading} style={{ padding: 0 }}>
          Kodu yenidən göndər
        </Button>
      </div>
    </Form>
  );
}
