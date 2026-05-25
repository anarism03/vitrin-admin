import React from "react";
import { Alert, App, Button, Empty, Spin } from "antd";
import ProductService from "../../services/ProductService";
import type { Product } from "../../types/product.type";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ProductFormModal } from "./components/ProductFormModal";
import { ProductsHeader } from "./components/ProductsHeader";
import { ProductsTable } from "./components/ProductsTable";
import { useProductForm } from "./hooks/useProductForm";
import { useProductList } from "./hooks/useProductList";

export default function Products() {
  const { message, modal } = App.useApp();
  const {
    categories,
    categoryId,
    error,
    fetchProducts,
    loading,
    page,
    pageSize,
    products,
    searchText,
    setPage,
    totalCount,
    updateCategoryId,
    updatePagination,
    updateSearchText,
  } = useProductList();

  const productForm = useProductForm({
    onSaved: async ({ isCreate }) => {
      if (isCreate) setPage(1);
      await fetchProducts(isCreate ? { page: 1 } : undefined);
    },
  });

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const deleteProduct = (product: Product) => {
    modal.confirm({
      title: "Məhsulu sil?",
      content: "Bu əməliyyat geri qaytarılmır.",
      okText: "Sil",
      cancelText: "İmtina",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await ProductService.remove(product.id);
          message.success("Məhsul silindi");

          if (products.length === 1 && page > 1) {
            setPage(page - 1);
            await fetchProducts({ page: page - 1 });
            return;
          }

          await fetchProducts();
        } catch (err) {
          message.error(getErrorMessage(err, "Məhsul silinmədi."));
        }
      },
    });
  };

  return (
    <div className="space-y-3">
      <ProductsHeader
        categoryId={categoryId}
        categoryOptions={categoryOptions}
        categoriesCount={categories.length}
        onCreate={productForm.openCreateModal}
        onRefresh={() => fetchProducts()}
        onCategoryChange={updateCategoryId}
        onSearchChange={updateSearchText}
        searchText={searchText}
        totalCount={totalCount}
      />

      {error ? (
        <Alert
          type="error"
          showIcon
          message={error}
          action={
            <Button size="small" danger onClick={() => fetchProducts()}>
              Təkrar yoxla
            </Button>
          }
        />
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spin />
          </div>
        ) : products.length ? (
          <ProductsTable
            onDelete={deleteProduct}
            onEdit={productForm.openEditModal}
            onPaginationChange={updatePagination}
            page={page}
            pageSize={pageSize}
            products={products}
            totalCount={totalCount}
          />
        ) : (
          <div className="flex min-h-64 items-center justify-center">
            <Empty description="Məhsul tapılmadı" />
          </div>
        )}
      </section>

      <ProductFormModal
        beforeUpload={productForm.beforeUpload}
        categoryOptions={categoryOptions}
        editingId={productForm.editingId}
        form={productForm.form}
        imageUrls={productForm.imageUrls}
        initialValues={productForm.initialValues}
        maxImageCount={productForm.maxImageCount}
        onCancel={productForm.resetModal}
        onRemoveImage={productForm.removeImage}
        onSubmit={() => void productForm.submit()}
        onUploadChange={productForm.handleUploadChange}
        open={productForm.open}
        saving={productForm.saving}
      />
    </div>
  );
}
