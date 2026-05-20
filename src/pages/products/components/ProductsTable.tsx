import { Button, Table, Tag } from "antd";
import type { TableProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import type { Product } from "../../../types/product.type";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { getImages, isProtectedProduct } from "../utils/productHelpers";

type ProductsTableProps = {
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
  page: number;
  pageSize: number;
  products: Product[];
  totalCount: number;
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
        <span className="font-semibold">{price} AZN</span>
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
      width: 190,
      align: "right",
      render: (_, product) => (
        <ProductRowActions
          product={product}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ),
    },
  ];

  return (
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
  );
}

function ProductThumb({ product }: { product: Product }) {
  const imageUrl = getImages(product)[0]?.url;

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

type RowActionsProps = {
  product: Product;
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
};

function ProductRowActions({ product, onDelete, onEdit }: RowActionsProps) {
  const locked = isProtectedProduct(product);

  return (
    <div className="flex justify-end gap-2">
      <Button
        danger
        disabled={locked}
        icon={<DeleteOutlined />}
        title={
          locked ? "Müəllimin yaratdığı ilkin məhsul silinmir" : "Məhsulu sil"
        }
        onClick={() => onDelete(product)}
      >
        Sil
      </Button>
      <Button icon={<EditOutlined />} onClick={() => onEdit(product)}>
        Redaktə et
      </Button>
    </div>
  );
}
