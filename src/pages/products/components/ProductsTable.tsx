import { Button, Pagination, Table, Tag } from "antd";
import type { TableProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import type { Product } from "../../../types/product.type";
import { resolveAssetUrl } from "../../../utils/assetUrl";

type ProductsTableProps = {
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
  page: number;
  pageSize: number;
  products: Product[];
  totalCount: number;
};

const getImageUrl = (product: Product) => {
  const image =
    product.images?.find((item) => item.isMain) || product.images?.[0];
  return image?.url || product.imageUrl || "";
};

export function ProductsTable({
  onDelete,
  onEdit,
  onPaginationChange,
  page,
  pageSize,
  products,
  totalCount,
}: ProductsTableProps) {
  const columns: TableProps<Product>["columns"] = [
    {
      title: "Şəkil",
      width: 86,
      render: (_, product) => <ProductThumb product={product} />,
    },
    {
      title: "Məhsul",
      render: (_, product) => (
        <div className="min-w-0">
          <p className="m-0 font-semibold text-slate-950">{product.name}</p>
          <p className="m-0 mt-1 max-w-sm truncate text-xs text-slate-500">
            {product.description || product.sku}
          </p>
        </div>
      ),
    },
    {
      title: "Kateqoriya",
      render: (_, product) => product.category?.name || "Kateqoriya yoxdur",
    },
    {
      title: "Qiymət",
      dataIndex: "price",
      render: (price: Product["price"]) => (
        <span className="font-semibold">{price} ₼</span>
      ),
    },
    { title: "Stok", dataIndex: "stock", width: 90 },
    { title: "SKU", dataIndex: "sku", ellipsis: true },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 100,
      render: (isActive: Product["isActive"]) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "Aktiv" : "Passiv"}
        </Tag>
      ),
    },
    {
      title: "",
      width: 150,
      align: "right",
      render: (_, product) => (
        <div className="flex justify-end gap-2">
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            aria-label="Sil"
            onClick={() => onDelete(product)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            aria-label="Redaktə et"
            onClick={() => onEdit(product)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="hidden 2xl:block">
        <Table<Product>
          rowKey="id"
          columns={columns}
          dataSource={products}
          scroll={{ x: 980 }}
          pagination={{
            current: page,
            pageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: [10, 12, 20, 50],
            showTotal: (total) => `${total} məhsul`,
            onChange: onPaginationChange,
          }}
        />
      </div>

      <div className="space-y-3 2xl:hidden">
        {products.map((product) => (
          <ProductMobileCard
            key={product.id}
            product={product}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}

        <div className="flex justify-center border-t border-slate-100 pt-3">
          <Pagination
            simple
            current={page}
            pageSize={pageSize}
            total={totalCount}
            onChange={onPaginationChange}
          />
        </div>
      </div>
    </>
  );
}

function ProductThumb({ product }: { product: Product }) {
  const imageUrl = getImageUrl(product);

  return (
    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-slate-100">
      {imageUrl ? (
        <img
          src={resolveAssetUrl(imageUrl)}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <ShoppingOutlined className="text-xl text-slate-300" />
      )}
    </div>
  );
}

type ProductMobileCardProps = {
  product: Product;
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
};

function ProductMobileCard({
  product,
  onDelete,
  onEdit,
}: ProductMobileCardProps) {
  const imageUrl = getImageUrl(product);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-[72px_1fr] gap-3">
        <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-lg bg-slate-100">
          {imageUrl ? (
            <img
              src={resolveAssetUrl(imageUrl)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ShoppingOutlined className="text-2xl text-slate-300" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="m-0 line-clamp-2 text-sm font-semibold text-slate-950">
                {product.name}
              </h3>
              <p className="m-0 mt-1 truncate text-xs text-slate-500">
                {product.category?.name || "Kateqoriya yoxdur"}
              </p>
            </div>
            <Tag
              color={product.isActive ? "green" : "default"}
              className="!m-0 !shrink-0"
            >
              {product.isActive ? "Aktiv" : "Passiv"}
            </Tag>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-slate-50 px-2 py-1.5">
              <p className="m-0 text-slate-400">Qiymət</p>
              <p className="m-0 truncate font-semibold text-slate-900">
                {product.price} ₼
              </p>
            </div>
            <div className="rounded-md bg-slate-50 px-2 py-1.5">
              <p className="m-0 text-slate-400">Stok</p>
              <p className="m-0 truncate font-semibold text-slate-900">
                {product.stock}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="m-0 mt-3 truncate text-xs text-slate-500">
        SKU: <span className="font-medium text-slate-700">{product.sku}</span>
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(product)}
          className="!h-10 !w-full"
        >
          Sil
        </Button>
        <Button
          icon={<EditOutlined />}
          onClick={() => onEdit(product)}
          className="!h-10 !w-full"
        >
          Redaktə
        </Button>
      </div>
    </article>
  );
}
