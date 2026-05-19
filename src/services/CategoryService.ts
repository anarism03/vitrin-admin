import type {
  CategoryFormValues,
  CategoryListParams,
  CategoryListResponse,
  CategoryOption,
  CategoryResponse,
} from "../types/category.type";
import axiosInstance from "./axiosInstance";

export const CategoryService = {
  getAll: (params: CategoryListParams) =>
    axiosInstance.get<CategoryListResponse>("/categories", { params }),
  getOptions: () => axiosInstance.get<CategoryOption[]>("/categories/options"),
  getById: (id: string) => axiosInstance.get<CategoryResponse>(`/categories/${id}`),
  create: (payload: CategoryFormValues) =>
    axiosInstance.post<CategoryResponse>("/categories", payload),
  update: (id: string, payload: CategoryFormValues) =>
    axiosInstance.patch<CategoryResponse>(`/categories/${id}`, payload),
  remove: (id: string) => axiosInstance.delete<CategoryResponse>(`/categories/${id}`),
};
