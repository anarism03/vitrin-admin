import { Form, Input, Modal, Switch } from "antd";
import type { FormInstance } from "antd";
import type { CategoryFormValues } from "../../../types/category.type";

type CategoryFormModalProps = {
  editingId: string | null;
  form: FormInstance<CategoryFormValues>;
  initialValues: Partial<CategoryFormValues>;
  onCancel: () => void;
  onSubmit: () => void;
  open: boolean;
  saving: boolean;
};

export default function CategoryFormModal({
  editingId,
  form,
  initialValues,
  onCancel,
  onSubmit,
  open,
  saving,
}: CategoryFormModalProps) {
  const isEdit = Boolean(editingId);

  const fillForm = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
  };

  return (
    <Modal
      title={isEdit ? "Kateqoriyanı redaktə et" : "Yeni kateqoriya"}
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={saving}
      okText={isEdit ? "Yenilə" : "Yarat"}
      cancelText="Bağla"
      style={{ top: 16, maxWidth: "calc(100vw - 16px)" }}
      afterOpenChange={(visible) => {
        if (visible) fillForm();
      }}
      destroyOnHidden
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        preserve={false}
        className="pt-2"
      >
        <Form.Item
          label="Ad"
          name="name"
          rules={[
            { required: true, message: "Kateqoriya adı tələb olunur" },
            { min: 2, message: "Ən azı 2 simvol" },
          ]}
        >
          <Input placeholder="Electronics" />
        </Form.Item>

        <Form.Item label="Açıqlama" name="description">
          <Input.TextArea rows={3} maxLength={300} showCount />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch checkedChildren="Aktiv" unCheckedChildren="Passiv" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
