import { useMemo } from "react";
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
import { getUserDisplayName } from "../../utils/authUser";
import { formatMoney, formatNumber } from "../../utils/formatters";
import LatestProductCard from "./components/LatestProductCard";
import SummaryCard from "./components/SummaryCard";
import { useDashboardStats } from "./hooks/useDashboardStats";

export default function Home() {
  const { user } = useAuth();
  const displayName = getUserDisplayName(user);
  const { stats, loading, error, fetchStats } = useDashboardStats();

  const valueOrLoading = (value: string) => (loading ? "..." : value);
  const helperOrLoading = (value: string) => (loading ? "Yüklənir" : value);

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
          `${formatNumber(stats?.verifiedUsers)} təsdiqli`,
        ),
        tone: "slate" as const,
      },
      {
        icon: <DatabaseOutlined />,
        label: "Stok sayı",
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
    [loading, stats],
  );

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

      <LatestProductCard
        loading={loading}
        latestProduct={stats?.latestProducts?.[0]}
      />
    </div>
  );
}
