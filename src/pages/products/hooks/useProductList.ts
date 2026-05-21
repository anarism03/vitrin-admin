import { useCallback, useEffect, useState } from "react";
import CategoryService from "../../../services/CategoryService";
import ProductService from "../../../services/ProductService";
import type { CategoryOption } from "../../../types/category.type";
import type { Product } from "../../../types/product.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";

type FetchOverrides = {
  page?: number;
  pageSize?: number;
  searchText?: string;
  categoryId?: string;
};

export function useProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();

  const fetchProducts = useCallback(
    async (overrides: FetchOverrides = {}) => {
      const nextPage = overrides.page ?? page;
      const nextPageSize = overrides.pageSize ?? pageSize;
      const nextSearchText = overrides.searchText ?? searchText;
      const nextCategoryId =
        overrides.categoryId !== undefined ? overrides.categoryId : categoryId;

      setLoading(true);
      setError("");

      try {
        const [productResponse, categoryResponse] = await Promise.all([
          ProductService.getAll({
            page: nextPage,
            pageSize: nextPageSize,
            name: nextSearchText.trim() || undefined,
            categoryId: nextCategoryId || undefined,
          }),
          CategoryService.getOptions(),
        ]);

        setProducts(productResponse.data.data);
        setTotalCount(productResponse.data.totalCount);
        setCategories(categoryResponse.data);
      } catch (err) {
        setError(getErrorMessage(err, "Məhsullar yüklənmədi."));
      } finally {
        setLoading(false);
      }
    },
    [categoryId, page, pageSize, searchText],
  );

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const updateSearchText = (value: string) => {
    setPage(1);
    setSearchText(value);
  };

  const updateCategoryId = (value?: string) => {
    setPage(1);
    setCategoryId(value);
  };

  const updatePagination = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  };

  return {
    categories,
    categoryId,
    error,
    fetchProducts,
    loading,
    page,
    pageSize,
    products,
    searchText,
    setPage,
    totalCount,
    updateCategoryId,
    updatePagination,
    updateSearchText,
  };
}
