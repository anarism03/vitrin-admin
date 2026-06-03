import { useRef, useState } from "react";
import { App, Form, Upload } from "antd";
import type { UploadProps } from "antd";
import ProductService from "../../../services/ProductService";
import UploadService from "../../../services/UploadService";
import type {
  Product,
  ProductFormValues,
  ProductImage,
  ProductPayload,
} from "../../../types/product.type";
import { getUploadedAssetPath } from "../../../utils/assetUrl";
import { getErrorMessage } from "../../../utils/getErrorMessage";

const MAX_IMAGE_COUNT = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type UseProductFormParams = {
  onSaved: (options: { isCreate: boolean }) => Promise<void> | void;
};

const unwrapProduct = (data: unknown, fallback: Product): Product => {
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data?: Product }).data ?? fallback;
  }

  return (data as Product) ?? fallback;
};

const getImages = (product: Product): ProductImage[] => {
  if (Array.isArray(product.images) && product.images.length) {
    return [...product.images].sort(
      (first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0),
    );
  }

  return product.imageUrl
    ? [{ url: product.imageUrl, isMain: true, sortOrder: 0 }]
    : [];
};

const imagePayload = (urls: string[]) =>
  urls.map((url, index) => ({
    url,
    sortOrder: index,
    isMain: index === 0,
  }));

const getUploadError = (err: unknown) => {
  const status = (err as { response?: { status?: number } })?.response?.status;

  if (status === 400) return "Şəkil faylları düzgün deyil.";
  if (status === 401) return "Sessiya bitib. Yenidən daxil olun.";
  if (status === 413) return "Şəkillərdən biri 5MB limitini keçib.";

  return getErrorMessage(err, "Şəkil yüklənmədi.");
};

const productValues = (
  product: Product,
): Partial<ProductFormValues> => {
  const price = Number(product.price);

  return {
    name: product.name,
    description: product.description || "",
    price: Number.isFinite(price) ? price : 0,
    stock: product.stock ?? 0,
    sku: product.sku,
    categoryId: product.categoryId,
    isActive: product.isActive,
  };
};

export function useProductForm({ onSaved }: UseProductFormParams) {
  const { message } = App.useApp();
  const [form] = Form.useForm<ProductFormValues>();
  const selectedFilesRef = useRef<File[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<Partial<ProductFormValues>>({
    stock: 0,
    isActive: true,
  });

  const resetModal = () => {
    selectedFilesRef.current = [];
    setImageUrls([]);
    setEditingId(null);
    setInitialValues({ stock: 0, isActive: true });
    setOpen(false);
    form.resetFields();
  };

  const openCreateModal = () => {
    selectedFilesRef.current = [];
    setEditingId(null);
    setImageUrls([]);
    setInitialValues({ stock: 0, isActive: true });
    setOpen(true);
  };

  const openEditModal = async (product: Product) => {
    selectedFilesRef.current = [];
    setEditingId(product.id);
    setImageUrls(getImages(product).map((image) => image.url));
    setInitialValues(productValues(product));
    setOpen(true);

    try {
      const { data } = await ProductService.getById(product.id);
      const freshProduct = unwrapProduct(data, product);
      const freshValues = productValues(freshProduct);

      setInitialValues(freshValues);
      setImageUrls(getImages(freshProduct).map((image) => image.url));
      form.setFieldsValue(freshValues);
    } catch (err) {
      message.warning(getErrorMessage(err, "Məhsul məlumatları yüklənmədi."));
    }
  };

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      message.error("Yalnız JPG, PNG və WEBP formatında şəkil seçin.");
      return Upload.LIST_IGNORE;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      message.error("Hər şəkil maksimum 5MB olmalıdır.");
      return Upload.LIST_IGNORE;
    }

    if (imageUrls.length + selectedFilesRef.current.length >= MAX_IMAGE_COUNT) {
      message.error("Maksimum 10 şəkil əlavə etmək olar.");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
    selectedFilesRef.current = fileList
      .map((file) => file.originFileObj)
      .filter(Boolean)
      .slice(0, MAX_IMAGE_COUNT - imageUrls.length) as File[];
  };

  const removeImage = (url: string) => {
    setImageUrls((current) => current.filter((imageUrl) => imageUrl !== url));
  };

  const submit = async () => {
    const values = await form.validateFields();
    const isCreate = !editingId;

    setSaving(true);

    try {
      let uploadedUrls: string[] = [];

      if (selectedFilesRef.current.length) {
        try {
          const { data } = await UploadService.productImages(
            selectedFilesRef.current,
          );
          uploadedUrls = data.urls;
        } catch (err) {
          message.error(getUploadError(err));
          return;
        }
      }

      const nextImageUrls = [...imageUrls, ...uploadedUrls].slice(
        0,
        MAX_IMAGE_COUNT,
      );
      const payloadImageUrls = nextImageUrls
        .map(getUploadedAssetPath)
        .filter(Boolean);
      const payload: ProductPayload = {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        price: Number(values.price),
        stock: Number(values.stock ?? 0),
        sku: values.sku.trim(),
        categoryId: values.categoryId,
        isActive: values.isActive ?? true,
        imageUrl: payloadImageUrls[0] || undefined,
        images:
          payloadImageUrls.length || editingId
            ? imagePayload(payloadImageUrls)
            : undefined,
      };

      if (editingId) {
        await ProductService.update(editingId, payload);
        message.success("Məhsul yeniləndi");
      } else {
        await ProductService.create(payload);
        message.success("Məhsul yaradıldı");
      }

      resetModal();
      await onSaved({ isCreate });
    } catch (err) {
      message.error(getErrorMessage(err, "Məhsul saxlanılmadı."));
    } finally {
      setSaving(false);
    }
  };

  return {
    beforeUpload,
    editingId,
    form,
    handleUploadChange,
    imageUrls,
    initialValues,
    maxImageCount: MAX_IMAGE_COUNT,
    open,
    openCreateModal,
    openEditModal,
    removeImage,
    resetModal,
    saving,
    submit,
  };
}
