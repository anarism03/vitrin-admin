import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 12;
  const searchText = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") || undefined;

  const fetchProducts = useCallback(async (overrides: FetchOverrides = {}) => {
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
  }, [categoryId, page, pageSize, searchText]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const updateSearchText = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("page", "1");
        if (value) prev.set("search", value);
        else prev.delete("search");
        return prev;
      },
      { replace: true }
    );
  };

  const updateCategoryId = (value?: string) => {
    setSearchParams(
      (prev) => {
        prev.set("page", "1");
        if (value) prev.set("category", value);
        else prev.delete("category");
        return prev;
      },
      { replace: true }
    );
  };

  const updatePagination = (nextPage: number, nextPageSize: number) => {
    setSearchParams(
      (prev) => {
        prev.set("page", nextPage.toString());
        prev.set("pageSize", nextPageSize.toString());
        return prev;
      },
      { replace: true }
    );
  };

  const setPage = (nextPage: number) => {
    setSearchParams(
      (prev) => {
        prev.set("page", nextPage.toString());
        return prev;
      },
      { replace: true }
    );
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
