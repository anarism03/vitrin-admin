import { useRef, useState } from "react";
import { App, Form, Upload } from "antd";
import type { UploadProps } from "antd";
import { ProductService } from "../../../services/ProductService";
import { UploadService } from "../../../services/UploadService";
import type {
  Product,
  ProductFormValues,
  ProductPayload,
} from "../../../types/product.type";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {
  IMAGE_TYPES,
  MAX_IMAGE_COUNT,
  MAX_IMAGE_SIZE,
  getImages,
  getUploadError,
  imagePayload,
  unwrapProduct,
} from "../utils/productHelpers";

type UseProductFormParams = {
  onSaved: (options: { isCreate: boolean }) => Promise<void> | void;
};

export function useProductForm({ onSaved }: UseProductFormParams) {
  const { message } = App.useApp();
  const [form] = Form.useForm<ProductFormValues>();
  const selectedFilesRef = useRef<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const resetModal = () => {
    selectedFilesRef.current = [];
    setImageUrls([]);
    setEditingProduct(null);
    setModalOpen(false);
    form.resetFields();
  };

  const openCreateModal = () => {
    selectedFilesRef.current = [];
    setEditingProduct(null);
    setImageUrls([]);
    form.resetFields();
    form.setFieldsValue({ stock: 0, isActive: true });
    setModalOpen(true);
  };

  const fillForm = (product: Product) => {
    const price = Number(product.price);

    form.setFieldsValue({
      name: product.name,
      description: product.description || "",
      price: Number.isFinite(price) ? price : 0,
      stock: product.stock ?? 0,
      sku: product.sku,
      categoryId: product.categoryId,
      isActive: product.isActive,
    });
    setImageUrls(getImages(product).map((image) => image.url));
  };

  const openEditModal = async (product: Product) => {
    selectedFilesRef.current = [];
    setEditingProduct(product);
    setModalOpen(true);
    fillForm(product);

    try {
      const { data } = await ProductService.getById(product.id);
      const freshProduct = unwrapProduct(data, product);
      setEditingProduct(freshProduct);
      fillForm(freshProduct);
    } catch {
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

  const handleSubmit = async () => {
    const values = await form.validateFields();
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
      const payload: ProductPayload = {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        price: Number(values.price),
        stock: Number(values.stock ?? 0),
        sku: values.sku.trim(),
        categoryId: values.categoryId,
        isActive: values.isActive ?? true,
        imageUrl: nextImageUrls[0]
          ? resolveAssetUrl(nextImageUrls[0])
          : undefined,
        images: nextImageUrls.length || editingProduct
          ? imagePayload(nextImageUrls)
          : undefined,
      };

      const isCreate = !editingProduct;

      if (editingProduct) {
        await ProductService.update(editingProduct.id, payload);
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
    editingProduct,
    form,
    handleSubmit,
    handleUploadChange,
    imageUrls,
    modalOpen,
    openCreateModal,
    openEditModal,
    removeImage,
    resetModal,
    saving,
  };
}
