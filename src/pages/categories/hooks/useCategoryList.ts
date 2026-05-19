import { useCallback, useEffect, useState } from "react";
import { CategoryService } from "../../../services/CategoryService";
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
  const [activeOptionsCount, setActiveOptionsCount] = useState(0);
  const [searchText, setSearchText] = useState("");

  const fetchCategories = useCallback(
    async (overrides: FetchOverrides = {}) => {
      const nextPage = overrides.page ?? page;
      const nextPageSize = overrides.pageSize ?? pageSize;
      const nextSearchText = overrides.searchText ?? searchText;

      setLoading(true);
      setError("");

      try {
        const [listResponse, optionsResponse] = await Promise.all([
          CategoryService.getAll({
            page: nextPage,
            pageSize: nextPageSize,
            name: nextSearchText.trim() || undefined,
          }),
          CategoryService.getOptions(),
        ]);
        const { data } = listResponse;

        setCategories(data.data.data);
        setTotalCount(data.data.totalCount);
        setActiveOptionsCount(optionsResponse.data.length);
      } catch (err) {
        setError(getErrorMessage(err, "Kateqoriyalar yüklənmədi."));
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchText],
  );

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const updateSearchText = (value: string) => {
    setPage(1);
    setSearchText(value);
  };

  const updatePagination = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  };

  return {
    activeOptionsCount,
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
