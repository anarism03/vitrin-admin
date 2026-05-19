import axios from "axios";
import type { Category } from "../../../types/category.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export const duplicateCategoryNameMessage =
  "Bu adda kateqoriya artıq mövcuddur.";

export const unwrapCategory = (payload: unknown, fallback: Category) => {
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data?: Category }).data;
    if (data) return data;
  }

  return fallback;
};

export const isDuplicateCategoryNameError = (err: unknown) => {
  if (!axios.isAxiosError(err)) return false;

  const status = err.response?.status;
  const errorMessage = getErrorMessage(err, "").toLowerCase();

  return (
    status === 409 ||
    [
      "already exists",
      "duplicate",
      "unique",
      "same name",
      "eyni ad",
      "artıq mövcuddur",
      "artiq movcuddur",
    ].some((part) => errorMessage.includes(part))
  );
};
