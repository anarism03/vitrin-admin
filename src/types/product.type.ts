export type ProductImage = {
  id?: string;
  url: string;
  isMain?: boolean;
  sortOrder?: number;
  createdAt?: string;
};

export type ProductCategoryRef = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  sku: string;
  imageUrl: string | null;
  images: ProductImage[];
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategoryRef;
};

export type ProductListParams = {
  page?: number;
  pageSize?: number;
  name?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type ProductImageInput = {
  url: string;
  sortOrder?: number;
  isMain?: boolean;
};

export type ProductPayload = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl?: string | null;
  isActive?: boolean;
  categoryId: string;
  images?: ProductImageInput[];
};

export type ProductFormValues = {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  sku: string;
  categoryId: string;
  isActive?: boolean;
};

export type ProductListResponse = {
  message: string;
  data: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type UploadProductImagesResponse = {
  urls: string[];
};
