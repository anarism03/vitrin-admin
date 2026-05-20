import type {
  Product,
  ProductListParams,
  ProductListResponse,
  ProductPayload,
} from "../types/product.type";
import axiosInstance from "./axiosInstance";

export const ProductService = {
  getAll: (params: ProductListParams) =>
    axiosInstance.get<ProductListResponse>("/products", { params }),
  getById: (id: string) => axiosInstance.get<Product>(`/products/${id}`),
  create: (payload: ProductPayload) =>
    axiosInstance.post<Product>("/products", payload),
  update: (id: string, payload: Partial<ProductPayload>) =>
    axiosInstance.patch<Product>(`/products/${id}`, payload),
  remove: (id: string) => axiosInstance.delete(`/products/${id}`),
};
