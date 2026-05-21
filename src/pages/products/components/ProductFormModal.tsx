import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Upload,
} from "antd";
import type { FormInstance, UploadProps } from "antd";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import type { ProductFormValues } from "../../../types/product.type";
import { resolveAssetUrl } from "../../../utils/assetUrl";

const { Dragger } = Upload;

type CategoryOption = {
  value: string;
  label: string;
};

type ProductFormModalProps = {
  beforeUpload: UploadProps["beforeUpload"];
  categoryOptions: CategoryOption[];
  editingId: string | null;
  form: FormInstance<ProductFormValues>;
  imageUrls: string[];
  initialValues: Partial<ProductFormValues>;
  maxImageCount: number;
  onCancel: () => void;
  onRemoveImage: (url: string) => void;
  onSubmit: () => void;
  onUploadChange: UploadProps["onChange"];
  open: boolean;
  saving: boolean;
};

export function ProductFormModal({
  beforeUpload,
  categoryOptions,
  editingId,
  form,
  imageUrls,
  initialValues,
  maxImageCount,
  onCancel,
  onRemoveImage,
  onSubmit,
  onUploadChange,
  open,
  saving,
}: ProductFormModalProps) {
  const isEdit = Boolean(editingId);
  const remainingSlots = Math.max(maxImageCount - imageUrls.length, 0);

  const fillForm = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
  };

  return (
    <Modal
      title={isEdit ? "Məhsulu redaktə et" : "Yeni məhsul"}
      open={open}
      onCancel={() => !saving && onCancel()}
      onOk={onSubmit}
      confirmLoading={saving}
      okText={isEdit ? "Yenilə" : "Yarat"}
      cancelText="Bağla"
      width={860}
      style={{ top: 12, maxWidth: "calc(100vw - 16px)" }}
      afterOpenChange={(visible) => {
        if (visible) fillForm();
      }}
      styles={{
        body: {
          maxHeight: "calc(100dvh - 160px)",
          overflowY: "auto",
          paddingRight: 4,
        },
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
        <div className="grid gap-3 sm:grid-cols-2">
          <Form.Item
            label="Ad"
            name="name"
            rules={[
              { required: true, message: "Məhsul adı tələb olunur" },
              { min: 2, message: "Ən azı 2 simvol" },
            ]}
          >
            <Input placeholder="iPhone 15 Pro" />
          </Form.Item>

          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: "SKU tələb olunur" }]}
          >
            <Input placeholder="IP15PRO-256-BLK" />
          </Form.Item>

          <Form.Item
            label="Qiymət"
            name="price"
            rules={[{ required: true, message: "Qiymət tələb olunur" }]}
          >
            <InputNumber min={0} precision={2} className="!w-full" />
          </Form.Item>

          <Form.Item label="Stok" name="stock" initialValue={0}>
            <InputNumber min={0} precision={0} className="!w-full" />
          </Form.Item>

          <Form.Item
            label="Kateqoriya"
            name="categoryId"
            rules={[{ required: true, message: "Kateqoriya seçin" }]}
          >
            <Select
              showSearch
              placeholder="Kateqoriya seçin"
              options={categoryOptions}
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="isActive"
            valuePropName="checked"
          >
            <Switch checkedChildren="Aktiv" unCheckedChildren="Passiv" />
          </Form.Item>
        </div>

        <Form.Item label="Açıqlama" name="description">
          <Input.TextArea rows={2} maxLength={500} showCount />
        </Form.Item>

        <Form.Item label={`Şəkillər (maks. ${maxImageCount})`}>
          <ImagePreviewList urls={imageUrls} onRemove={onRemoveImage} />

          <Dragger
            accept="image/jpeg,image/png,image/webp"
            beforeUpload={beforeUpload}
            maxCount={remainingSlots}
            multiple
            onChange={onUploadChange}
            listType="picture"
            disabled={imageUrls.length >= maxImageCount}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Şəkil seç</p>
            <p className="ant-upload-hint">JPG, PNG, WEBP. Fayl maksimum 5MB.</p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}

type ImagePreviewListProps = {
  urls: string[];
  onRemove: (url: string) => void;
};

function ImagePreviewList({ urls, onRemove }: ImagePreviewListProps) {
  if (!urls.length) return null;

  return (
    <div className="mb-3 flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
      {urls.map((url) => (
        <div
          key={url}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white"
        >
          <img
            src={resolveAssetUrl(url)}
            alt="Məhsul şəkli"
            className="h-full w-full object-cover"
          />
          <Button
            danger
            size="small"
            type="primary"
            aria-label="Şəkli sil"
            icon={<DeleteOutlined />}
            onClick={() => onRemove(url)}
            className="!absolute !right-1 !top-1 !flex !h-6 !w-6 !items-center !justify-center !p-0"
          />
        </div>
      ))}
    </div>
  );
}
