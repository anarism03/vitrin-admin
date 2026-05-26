import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryService from "../../../services/CategoryService";
import type { Category } from "../../../types/category.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";

type FetchOverrides = {
  page?: number;
  pageSize?: number;
  searchText?: string;
};

export function useCategoryList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchText = searchParams.get("search") || "";

  const fetchCategories = useCallback(async (overrides: FetchOverrides = {}) => {
    const nextPage = overrides.page ?? page;
    const nextPageSize = overrides.pageSize ?? pageSize;
    const nextSearchText = overrides.searchText ?? searchText;

    setLoading(true);
    setError("");

    try {
      const response = await CategoryService.getAll({
        page: nextPage,
        pageSize: nextPageSize,
        name: nextSearchText.trim() || undefined,
      });
      const payload = response.data.data;

      setCategories(payload.data);
      setTotalCount(payload.totalCount);
    } catch (err) {
      setError(getErrorMessage(err, "Kateqoriyalar yüklənmədi."));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

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
    error,
    fetchCategories,
    loading,
    page,
    pageSize,
    searchText,
    setPage,
    totalCount,
    updatePagination,
    updateSearchText,
  };
}
