import { Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import type { DashboardLatestProduct } from "../../../types/dashboard.type";
import { resolveAssetUrl } from "../../../utils/assetUrl";

type LatestProductCardProps = {
  latestProduct?: DashboardLatestProduct;
  loading: boolean;
};

const getProductImage = (product?: DashboardLatestProduct) =>
  product?.images?.find((image) => image.isMain)?.url ||
  product?.images?.[0]?.url ||
  product?.imageUrl ||
  "";

export default function LatestProductCard({
  latestProduct,
  loading,
}: LatestProductCardProps) {
  const imageUrl = getProductImage(latestProduct);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-xs font-medium uppercase text-slate-400">
            Son əlavə olunan
          </p>
          <h3 className="m-0 mt-1 text-base font-semibold text-slate-950">
            Son məhsul
          </h3>
        </div>
        <Tag color={latestProduct?.isActive ? "green" : "default"}>
          {loading ? "Yüklənir" : latestProduct?.isActive ? "Aktiv" : "Passiv"}
        </Tag>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-[112px_1fr]">
          <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
          <div className="space-y-3 py-1">
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ) : latestProduct ? (
        <div className="grid gap-3 sm:grid-cols-[112px_1fr] sm:items-center">
          <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
            {imageUrl ? (
              <img
                src={resolveAssetUrl(imageUrl)}
                alt={latestProduct.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ShoppingCartOutlined className="text-3xl text-slate-300" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h4 className="m-0 truncate text-lg font-semibold text-slate-950">
                  {latestProduct.name}
                </h4>
                <p className="m-0 mt-1 truncate text-sm text-slate-500">
                  {latestProduct.category?.name || "Kateqoriya yoxdur"}
                </p>
              </div>
              <p className="m-0 text-lg font-semibold text-emerald-700">
                {latestProduct.price ? `${latestProduct.price} ₼` : "-"}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="m-0 text-xs text-slate-400">Stok</p>
                <p className="m-0 mt-1 font-semibold text-slate-900">
                  {latestProduct.stock ?? "-"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="m-0 text-xs text-slate-400">Kateqoriya</p>
                <p className="m-0 mt-1 truncate font-semibold text-slate-900">
                  {latestProduct.category?.name || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          Son məhsul tapılmadı.
        </div>
      )}
    </section>
  );
}
