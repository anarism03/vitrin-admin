import { useMemo, useState } from "react";
import {
  Alert,
  App,
  Button,
  Form,
  Input,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
} from "antd";
import type { TableProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { CategoryService } from "../../services/CategoryService";
import type { Category, CategoryFormValues } from "../../types/category.type";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useCategoryList } from "./hooks/useCategoryList";
import {
  duplicateCategoryNameMessage,
  isDuplicateCategoryNameError,
  unwrapCategory,
} from "./utils/categoryHelpers";

export default function Categories() {
  const { message, modal } = App.useApp();
  const [form] = Form.useForm<CategoryFormValues>();
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const {
    activeOptionsCount,
    categories,
    error,
    fetchCategories,
    loading,
    page,
    pageSize,
    searchText,
    setPage,
    totalCount,
    updatePagination,
    updateSearchText,
  } = useCategoryList();

  const openCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setModalOpen(true);
  };

  const openEditModal = async (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
    form.setFieldsValue({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
    });

    try {
      const { data } = await CategoryService.getById(category.id);
      const freshCategory = unwrapCategory(data, category);
      setEditingCategory(freshCategory);
      form.setFieldsValue({
        name: freshCategory.name,
        description: freshCategory.description || "",
        isActive: freshCategory.isActive,
      });
    } catch {
      // Row data is enough to keep the edit modal usable if detail fetch fails.
    }
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: CategoryFormValues = {
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      isActive: values.isActive ?? true,
    };

    setSaving(true);

    try {
      if (editingCategory) {
        await CategoryService.update(editingCategory.id, payload);
        message.success("Kateqoriya yeniləndi");
      } else {
        await CategoryService.create(payload);
        setPage(1);
        message.success("Kateqoriya yaradıldı");
      }

      setModalOpen(false);
      setEditingCategory(null);
      form.resetFields();
      await fetchCategories(editingCategory ? undefined : { page: 1 });
    } catch (err) {
      if (isDuplicateCategoryNameError(err)) {
        form.setFields([
          {
            name: "name",
            errors: [duplicateCategoryNameMessage],
          },
        ]);
        message.error(duplicateCategoryNameMessage);
        return;
      }

      message.error(getErrorMessage(err, "Əməliyyat tamamlanmadı."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (category: Category) => {
    modal.confirm({
      title: "Kateqoriyanı sil?",
      content:
        category.productsCount > 0
          ? "Bu kateqoriyada məhsul var. Backend silməyə icazə verməyə bilər."
          : "Bu əməliyyat geri qaytarılmır.",
      okText: "Sil",
      okButtonProps: { danger: true },
      cancelText: "İmtina",
      async onOk() {
        try {
          await CategoryService.remove(category.id);
          message.success("Kateqoriya silindi");

          if (categories.length === 1 && page > 1) {
            setPage(page - 1);
            await fetchCategories({ page: page - 1 });
          } else {
            await fetchCategories();
          }
        } catch (err) {
          message.error(getErrorMessage(err, "Kateqoriya silinmədi."));
        }
      },
    });
  };

  const columns = useMemo<TableProps<Category>["columns"]>(
    () => [
      {
        title: "Ad",
        dataIndex: "name",
        key: "name",
        render: (name: string, record) => (
          <div className="min-w-0">
            <p className="m-0 max-w-[360px] truncate font-semibold text-slate-950">
              {name}
            </p>
            <p className="m-0 mt-1 max-w-[420px] truncate text-xs text-slate-500">
              {record.description || "Açıqlama yoxdur"}
            </p>
          </div>
        ),
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        width: 120,
        render: (isActive: boolean) => (
          <Tag color={isActive ? "green" : "default"}>
            {isActive ? "Aktiv" : "Passiv"}
          </Tag>
        ),
      },
      {
        title: "Məhsul",
        dataIndex: "productsCount",
        key: "productsCount",
        width: 110,
        render: (count: number) => (
          <span className="font-semibold text-slate-900">{count}</span>
        ),
      },
      {
        title: "",
        key: "actions",
        width: 120,
        render: (_, record) => (
          <Space size={4}>
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label="Redaktə et"
              onClick={() => void openEditModal(record)}
            />
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              aria-label="Sil"
              onClick={() => handleDelete(record)}
            />
          </Space>
        ),
      },
    ],
    [categories.length, fetchCategories, modal, page],
  );

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-600">
              Categories
            </p>
            <h2 className="m-0 mt-1 text-xl font-semibold text-slate-950">
              Kateqoriyalar
            </h2>
            <p className="m-0 mt-1 text-sm text-slate-500">
              Kateqoriya siyahısı, yaratma, redaktə və silmə əməliyyatları.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-72">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="m-0 text-xs text-slate-400">Ümumi</p>
              <p className="m-0 mt-1 text-lg font-semibold text-slate-950">
                {totalCount}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="m-0 text-xs text-emerald-600">Aktiv seçimlər</p>
              <p className="m-0 mt-1 text-lg font-semibold text-emerald-700">
                {activeOptionsCount}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Ada görə axtar"
            value={searchText}
            onChange={(event) => updateSearchText(event.target.value)}
            className="sm:!w-64"
          />
          <Button icon={<ReloadOutlined />} onClick={() => fetchCategories()}>
            Yenilə
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Yeni kateqoriya
          </Button>
        </div>
      </section>

      {error ? (
        <Alert
          type="error"
          showIcon
          message={error}
          action={
            <Button size="small" danger onClick={() => fetchCategories()}>
              Təkrar yoxla
            </Button>
          }
        />
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
        <Table<Category>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={categories}
          scroll={{ x: 820 }}
          pagination={{
            current: page,
            pageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            showTotal: (total) => `${total} kateqoriya`,
            onChange: updatePagination,
          }}
        />
      </section>

      <Modal
        title={editingCategory ? "Kateqoriyanı redaktə et" : "Yeni kateqoriya"}
        open={modalOpen}
        onCancel={closeModal}
        onOk={() => void handleSubmit()}
        confirmLoading={saving}
        okText={editingCategory ? "Yenilə" : "Yarat"}
        cancelText="Bağla"
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
            <Input.TextArea
              rows={3}
              placeholder="Devices and gadgets"
              maxLength={300}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="isActive"
            valuePropName="checked"
            initialValue
          >
            <Switch checkedChildren="Aktiv" unCheckedChildren="Passiv" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
