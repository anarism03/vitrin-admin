import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Tag } from "antd";
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  DollarOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../auth/AuthContext";
import { DashboardService } from "../../services/DashboardService";
import type { DashboardStats } from "../../types/dashboard.type";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { getUserDisplayName } from "../../utils/authUser";
import SummaryCard from "./components/SummaryCard";

const numberFormatter = new Intl.NumberFormat("az-AZ");
const moneyFormatter = new Intl.NumberFormat("az-AZ", {
  style: "currency",
  currency: "AZN",
  maximumFractionDigits: 2,
});
const dateFormatter = new Intl.DateTimeFormat("az-AZ", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formatNumber = (value?: number) =>
  value === undefined ? "-" : numberFormatter.format(value);

const formatMoney = (value?: string) => {
  if (!value) return "-";

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue)
    ? moneyFormatter.format(parsedValue)
    : value;
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  const parsedValue = new Date(value);
  return Number.isNaN(parsedValue.getTime())
    ? value
    : dateFormatter.format(parsedValue);
};

export default function Home() {
  const { user } = useAuth();
  const displayName = getUserDisplayName(user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const initialLoadStarted = useRef(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await DashboardService.getStats();
      setStats(data.data);
    } catch (err) {
      setError(getErrorMessage(err, "Dashboard məlumatları yüklənmədi."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoadStarted.current) return;

    initialLoadStarted.current = true;
    void fetchStats();
  }, [fetchStats]);

  const valueOrLoading = useCallback(
    (value: string) => (loading ? "..." : value),
    [loading],
  );
  const helperOrLoading = useCallback(
    (value: string) => (loading ? "Yüklənir" : value),
    [loading],
  );

  const cards = useMemo(
    () => [
      {
        icon: <AppstoreOutlined />,
        label: "Kateqoriyalar",
        value: valueOrLoading(formatNumber(stats?.totalCategories)),
        helper: helperOrLoading(`${formatNumber(stats?.activeCategories)} aktiv`),
        tone: "blue" as const,
      },
      {
        icon: <ShoppingCartOutlined />,
        label: "Məhsullar",
        value: valueOrLoading(formatNumber(stats?.totalProducts)),
        helper: helperOrLoading(`${formatNumber(stats?.activeProducts)} aktiv`),
        tone: "green" as const,
      },
      {
        icon: <TeamOutlined />,
        label: "İstifadəçilər",
        value: valueOrLoading(formatNumber(stats?.totalUsers)),
        helper: helperOrLoading(
          `${formatNumber(stats?.verifiedUsers)} tesdiqli`,
        ),
        tone: "slate" as const,
      },
      {
        icon: <DatabaseOutlined />,
        label: "Stok sayi",
        value: valueOrLoading(formatNumber(stats?.totalStock)),
        helper: helperOrLoading("Ümumi stok"),
        tone: "blue" as const,
      },
      {
        icon: <WarningOutlined />,
        label: "Az stok",
        value: valueOrLoading(formatNumber(stats?.lowStockProducts)),
        helper: helperOrLoading("Diqqət tələb edir"),
        tone: "amber" as const,
      },
      {
        icon: <DollarOutlined />,
        label: "İnventar dəyəri",
        value: valueOrLoading(formatMoney(stats?.totalInventoryValue)),
        helper: helperOrLoading("Toplam dəyər"),
        tone: "green" as const,
      },
    ],
    [helperOrLoading, stats, valueOrLoading],
  );
  const latestProduct = stats?.latestProducts?.[0];

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Tag color="blue" className="!mb-2 !rounded-md">
              {user?.role || "user"}
            </Tag>
            <h2 className="m-0 text-xl font-semibold text-slate-950 sm:text-2xl">
              Salam, {displayName}
            </h2>
            <p className="m-0 mt-1 text-sm leading-5 text-slate-500">
              Dashboard statistikaları tokenli sorğu ilə yenilənir.
            </p>
          </div>

          <Button
            icon={loading ? <ReloadOutlined spin /> : <CheckCircleOutlined />}
            loading={loading}
            onClick={fetchStats}
          >
            Yenilə
          </Button>
        </div>
      </section>

      {error ? (
        <Alert
          type="error"
          showIcon
          message={error}
          action={
            <Button size="small" danger onClick={fetchStats}>
              Təkrar yoxla
            </Button>
          }
        />
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
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
          <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
            <div className="space-y-3 py-1">
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ) : latestProduct ? (
          <div className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-center">
            <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
              {latestProduct.imageUrl ? (
                <img
                  src={latestProduct.imageUrl}
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
                  {formatMoney(latestProduct.price)}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="m-0 text-xs text-slate-400">Stok</p>
                  <p className="m-0 mt-1 font-semibold text-slate-900">
                    {formatNumber(latestProduct.stock)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="m-0 text-xs text-slate-400">Tarix</p>
                  <p className="m-0 mt-1 font-semibold text-slate-900">
                    {formatDate(latestProduct.createdAt)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="m-0 text-xs text-slate-400">ID</p>
                  <p className="m-0 mt-1 truncate font-semibold text-slate-900">
                    {latestProduct.id}
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
    </div>
  );
}
