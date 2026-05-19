export type DashboardLatestProduct = {
  id: string;
  name: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
};

export type DashboardStats = {
  totalCategories: number;
  activeCategories: number;
  totalProducts: number;
  activeProducts: number;
  totalUsers: number;
  verifiedUsers: number;
  lowStockProducts: number;
  totalStock: number;
  totalInventoryValue: string;
  latestProducts?: DashboardLatestProduct[];
};

export type DashboardStatsResponse = {
  message: string;
  data: DashboardStats;
};
