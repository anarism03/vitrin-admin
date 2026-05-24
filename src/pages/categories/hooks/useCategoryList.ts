import { useEffect, useState } from "react";
import CategoryService from "../../../services/CategoryService";
import type { Category } from "../../../types/category.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";

type FetchOverrides = {
  page?: number;
  pageSize?: number;
  searchText?: string;
};

export function useCategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");

  const fetchCategories = async (overrides: FetchOverrides = {}) => {
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
    };

  useEffect(() => {
    void fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSearchText = (value: string) => {
    setPage(1);
    setSearchText(value);
    void fetchCategories({ page: 1, searchText: value });
  };

  const updatePagination = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
    void fetchCategories({ page: nextPage, pageSize: nextPageSize });
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
