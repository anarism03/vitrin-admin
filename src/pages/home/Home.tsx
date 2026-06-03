import { Alert, Button, Tag } from "antd";
import {
  AppstoreOutlined,
  DatabaseOutlined,
  DollarOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../store/hooks";
import { getUserDisplayName } from "../../utils/authUser";
import LatestProductCard from "./components/LatestProductCard";
import { useDashboardStats } from "./hooks/useDashboardStats";

const statIcons = [
  <AppstoreOutlined />,
  <ShoppingCartOutlined />,
  <TeamOutlined />,
  <DatabaseOutlined />,
  <WarningOutlined />,
  <DollarOutlined />,
];

export default function Home() {
  const user = useAppSelector((state) => state.auth.user);
  const canViewDashboardStats = user?.role === "admin";
  const { stats, loading, error, fetchStats } = useDashboardStats(
    canViewDashboardStats,
  );
  const displayName = getUserDisplayName(user);
  const latestProduct = stats?.latestProducts?.[0];

  const cards = [
    ["Kateqoriyalar", stats?.totalCategories, `${stats?.activeCategories ?? "-"} aktiv`],
    ["Məhsullar", stats?.totalProducts, `${stats?.activeProducts ?? "-"} aktiv`],
    ["İstifadəçilər", stats?.totalUsers, `${stats?.verifiedUsers ?? "-"} təsdiqli`],
    ["Stok", stats?.totalStock, "Ümumi stok"],
    ["Az stok", stats?.lowStockProducts, "Diqqət tələb edir"],
    ["İnventar dəyəri", stats?.totalInventoryValue, "Ümumi dəyər"],
  ];

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Tag color="blue" className="!mb-2">
              {user?.role || "user"}
            </Tag>
            <h2 className="m-0 text-xl font-semibold text-slate-950 sm:text-2xl">
              Salam, {displayName}
            </h2>
            <p className="m-0 mt-1 text-sm text-slate-500">
              Panel statistikalarını buradan izləyin.
            </p>
          </div>

          <Button
            icon={<ReloadOutlined />}
            loading={loading}
            disabled={!canViewDashboardStats}
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
            <Button
              size="small"
              danger
              disabled={!canViewDashboardStats}
              onClick={fetchStats}
            >
              Təkrar yoxla
            </Button>
          }
        />
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(([label, value, helper], index) => (
          <div
            key={String(label)}
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              {statIcons[index]}
            </div>
            <p className="m-0 text-xs font-medium uppercase text-slate-400">
              {label}
            </p>
            <p className="m-0 mt-1 truncate text-base font-semibold text-slate-950">
              {loading ? "..." : String(value ?? "-")}
            </p>
            <p className="m-0 mt-1 truncate text-xs text-slate-500">
              {loading ? "Yüklənir" : helper}
            </p>
          </div>
        ))}
      </div>

      <LatestProductCard latestProduct={latestProduct} loading={loading} />
    </div>
  );
}
