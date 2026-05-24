
import { Alert, App, Button, Input, Pagination, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CategoryService from "../../services/CategoryService";
import type { Category } from "../../types/category.type";
import { getErrorMessage } from "../../utils/getErrorMessage";
import CategoryFormModal from "./components/CategoryFormModal";
import { useCategoryForm } from "./hooks/useCategoryForm";
import { useCategoryList } from "./hooks/useCategoryList";

export default function Categories() {
  const { message, modal } = App.useApp();
  const {
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
  const categoryForm = useCategoryForm({
    onSaved: async ({ isCreate }) => {
      if (isCreate) setPage(1);
      await fetchCategories(isCreate ? { page: 1 } : undefined);
    },
  });

  const deleteCategory = (category: Category) => {
    modal.confirm({
      title: "Kateqoriyanı sil?",
      content: "Bu əməliyyat geri qaytarılmır.",
      okText: "Sil",
      cancelText: "İmtina",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await CategoryService.remove(category.id);
          message.success("Kateqoriya silindi");

          if (categories.length === 1 && page > 1) {
            setPage(page - 1);
            await fetchCategories({ page: page - 1 });
            return;
          }

          await fetchCategories();
        } catch (err) {
          message.error(getErrorMessage(err, "Kateqoriya silinmədi."));
        }
      },
    });
  };

  const columns: TableProps<Category>["columns"] = [
      {
        title: "Ad",
        dataIndex: "name",
        render: (name: string, category) => (
          <div className="min-w-0">
            <p className="m-0 font-semibold text-slate-950">{name}</p>
            <p className="m-0 mt-1 max-w-md truncate text-xs text-slate-500">
              {category.description || "Açıqlama yoxdur"}
            </p>
          </div>
        ),
      },
      {
        title: "Status",
        dataIndex: "isActive",
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
        width: 110,
      },
      {
        title: "",
        width: 120,
        render: (_, category) => (
          <Space size={4}>
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label="Redaktə et"
              onClick={() => categoryForm.openModal(category)}
            />
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              aria-label="Sil"
              onClick={() => deleteCategory(category)}
            />
          </Space>
        ),
      },
    ];

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="m-0 text-xl font-semibold text-slate-950">
              Kateqoriyalar
            </h2>
            <p className="m-0 mt-1 text-sm text-slate-500">
              Siyahı, yaratma, redaktə və silmə əməliyyatları.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:bg-transparent sm:p-0">
            Ümumi: <b className="text-slate-900">{totalCount}</b>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:flex lg:flex-row">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Ada görə axtar"
            value={searchText}
            onChange={(event) => updateSearchText(event.target.value)}
            className="!w-full lg:!w-64"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchCategories()}
            className="!w-full lg:!w-auto"
          >
            Yenilə
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => categoryForm.openModal()}
            className="!w-full sm:col-span-2 lg:!w-auto"
          >
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
        <div className="hidden xl:block">
          <Table<Category>
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={categories}
            scroll={{ x: 780 }}
            pagination={{
              current: page,
              pageSize,
              total: totalCount,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              showTotal: (total) => `${total} kateqoriya`,
              onChange: updatePagination,
            }}
          />
        </div>

        <div className="space-y-3 xl:hidden">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : categories.length ? (
            <>
              {categories.map((category) => (
                <CategoryMobileCard
                  key={category.id}
                  category={category}
                  onDelete={deleteCategory}
                  onEdit={categoryForm.openModal}
                />
              ))}

              <div className="flex justify-center border-t border-slate-100 pt-3">
                <Pagination
                  simple
                  current={page}
                  pageSize={pageSize}
                  total={totalCount}
                  onChange={updatePagination}
                />
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
              Kateqoriya tapılmadı
            </div>
          )}
        </div>
      </section>

      <CategoryFormModal
        editingId={categoryForm.editingId}
        form={categoryForm.form}
        initialValues={categoryForm.initialValues}
        onCancel={categoryForm.closeModal}
        onSubmit={() => void categoryForm.submit()}
        open={categoryForm.open}
        saving={categoryForm.saving}
      />
    </div>
  );
}

type CategoryMobileCardProps = {
  category: Category;
  onDelete: (category: Category) => void;
  onEdit: (category: Category) => void;
};

function CategoryMobileCard({
  category,
  onDelete,
  onEdit,
}: CategoryMobileCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="m-0 line-clamp-2 text-sm font-semibold text-slate-950">
            {category.name}
          </h3>
          <p className="m-0 mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {category.description || "Açıqlama yoxdur"}
          </p>
        </div>
        <Tag
          color={category.isActive ? "green" : "default"}
          className="!m-0 !shrink-0"
        >
          {category.isActive ? "Aktiv" : "Passiv"}
        </Tag>
      </div>

      <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs">
        <p className="m-0 text-slate-400">Məhsul sayı</p>
        <p className="m-0 mt-1 font-semibold text-slate-900">
          {category.productsCount}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(category)}
          className="!h-10 !w-full"
        >
          Sil
        </Button>
        <Button
          icon={<EditOutlined />}
          onClick={() => onEdit(category)}
          className="!h-10 !w-full"
        >
          Redaktə
        </Button>
      </div>
    </article>
  );
}
