import type { Product, ProductImage } from "../../../types/product.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export const MAX_IMAGE_COUNT = 10;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const PROTECTED_PRODUCT_ID = "6c8be969-8b03-4db7-92ad-d88ec317168b";
const PROTECTED_PRODUCT_SKU = "IP15PRO-256-BLK";

export const getImages = (product: Product): ProductImage[] => {
  if (Array.isArray(product.images) && product.images.length) {
    return [...product.images].sort(
      (first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0),
    );
  }

  return product.imageUrl
    ? [{ url: product.imageUrl, isMain: true, sortOrder: 0 }]
    : [];
};

export const unwrapProduct = (payload: unknown, fallback: Product): Product => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: Product }).data || fallback;
  }

  if (payload && typeof payload === "object" && "id" in payload) {
    return payload as Product;
  }

  return fallback;
};

export const isProtectedProduct = (product: Product) =>
  product.id === PROTECTED_PRODUCT_ID || product.sku === PROTECTED_PRODUCT_SKU;

export const imagePayload = (urls: string[]) =>
  urls.map((url, index) => ({
    url,
    sortOrder: index,
    isMain: index === 0,
  }));

export const getUploadError = (err: unknown) => {
  const status = (err as { response?: { status?: number } })?.response?.status;

  if (status === 400) return "Şəkil faylları düzgün deyil və ya seçilməyib.";
  if (status === 401) {
    return "Sessiya bitib və ya access token yanlışdır. Yenidən daxil olun.";
  }
  if (status === 413) return "Şəkillərdən biri 5MB limitini keçib.";

  return getErrorMessage(err, "Şəkil yüklənmədi.");
};
