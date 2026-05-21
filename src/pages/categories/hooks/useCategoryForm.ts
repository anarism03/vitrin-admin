import { useState } from "react";
import { App, Form } from "antd";
import CategoryService from "../../../services/CategoryService";
import type {
  Category,
  CategoryFormValues,
} from "../../../types/category.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";

type UseCategoryFormParams = {
  onSaved: (options: { isCreate: boolean }) => Promise<void> | void;
};

const categoryValues = (
  category?: Category,
): Partial<CategoryFormValues> => ({
  name: category?.name ?? "",
  description: category?.description ?? "",
  isActive: category?.isActive ?? true,
});

const unwrapCategory = (data: unknown, fallback: Category): Category => {
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data?: Category }).data ?? fallback;
  }

  return (data as Category) ?? fallback;
};

export function useCategoryForm({ onSaved }: UseCategoryFormParams) {
  const { message } = App.useApp();
  const [form] = Form.useForm<CategoryFormValues>();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<CategoryFormValues>>({
    isActive: true,
  });

  const openModal = async (category?: Category) => {
    const values = categoryValues(category);

    setEditingId(category?.id ?? null);
    setInitialValues(values);
    setOpen(true);

    if (!category?.id) return;

    try {
      const { data } = await CategoryService.getById(category.id);
      const freshCategory = unwrapCategory(data, category);
      const freshValues = categoryValues(freshCategory);

      setInitialValues(freshValues);
      form.setFieldsValue(freshValues);
    } catch (err) {
      message.warning(getErrorMessage(err, "Kateqoriya məlumatları yüklənmədi."));
    }
  };

  const closeModal = () => {
    if (saving) return;
    setOpen(false);
    setEditingId(null);
    setInitialValues({ isActive: true });
    form.resetFields();
  };

  const submit = async () => {
    const values = await form.validateFields();
    const payload: CategoryFormValues = {
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      isActive: values.isActive ?? true,
    };
    const isCreate = !editingId;

    setSaving(true);

    try {
      if (editingId) {
        await CategoryService.update(editingId, payload);
        message.success("Kateqoriya yeniləndi");
      } else {
        await CategoryService.create(payload);
        message.success("Kateqoriya yaradıldı");
      }

      closeModal();
      await onSaved({ isCreate });
    } catch (err) {
      message.error(getErrorMessage(err, "Əməliyyat tamamlanmadı."));
    } finally {
      setSaving(false);
    }
  };

  return {
    closeModal,
    editingId,
    form,
    initialValues,
    open,
    openModal,
    saving,
    submit,
  };
}
