export type Category = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productsCount: number;
};

export type CategoryOption = {
  id: string;
  name: string;
};

export type CategoryListParams = {
  page?: number;
  pageSize?: number;
  name?: string;
};

export type CategoryFormValues = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export type CategoryPaginationData = {
  data: Category[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CategoryListResponse = {
  message: string;
  data: CategoryPaginationData;
};

export type CategoryResponse = {
  message?: string;
  data?: Category;
};
